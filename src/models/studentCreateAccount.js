const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validatePhoneNo = require('validate-phone-number-node-js')
const studentSignUpSchema = new mongoose.Schema({
	username:{
			type:String,
			required:true,
			trim: true,
			unique:true
		},
	email:{
			type: String,
			required: true,
			unique: true,
			trim: true,
			validate(value){
				if(!validator.isEmail(value)){
					throw new Error("Email is Invalid")
				}
			}
	},
	password:{
			type: String,
			required:true,
			required:true,
			minlength: 6,
			validate(value){

				if(value.toLowerCase().includes("password")){
					throw new Error("Containig password as Substring")
				}
			}
	},
	mobileNo:{
		type: String,
		required: true,
		unique: true,
		validate(value){
			if(!validatePhoneNo.validate(value))
				throw new Error("Not a valid Phone Number")
		}
	},
	hostel:{
		type:String,
		required:true
	},
	roomNo:{
		type:String,
		trim:true,
		required:true,
		validate(value){
				if(!validator.isLength(value,3,5))
				{
					throw new Error('Room no. is invalid')
				}
			}
	},
	rollNo:{
			type:String,
			required:true
		},
	tokens:[{
		token:{
			type:String,
			required: true
		}
	}],
	adminId:{
		type:String,
		required:true
	},
	complaints:[{
		complaint:{
		type:String,
		trim:true
		},
		date: {
		 type: Date
		},
		answer:{
			type:String,
			trim:true,
			default:"Answers will be provide to you"
		},
		status:{
			type:String,
			trim:true,
			default:"Not seen"
		}
	}]
})

studentSignUpSchema.methods.generateAuthToken = async function(){
	const studentData = this
	// console.log(studentData)
	const token = jwt.sign({_id:studentData._id.toString()}, "thisisnodecourse")
	studentData.tokens = studentData.tokens.concat({token})
	await studentData.save()
	return token
}	

studentSignUpSchema.statics.findByCredentials = async (email, password)=>{
	const studentData = await studentSignUp.findOne({email})
	if(!studentData){
		throw new Error("Unable to login")
	}
	const isMatch = await bcrypt.compare(password, studentData.password)
	if(!isMatch)
	{
		throw new Error("Unable to login your password is incorrect")
	}
	return studentData
}

studentSignUpSchema.pre('save', async function(next){
	const studentData = this
	if(studentData.isModified('password'))
		studentData.password = await bcrypt.hash(studentData.password, 8)
	next()
})

const studentSignUp = mongoose.model('studentSignUp', studentSignUpSchema)
module.exports = studentSignUp

studentSignUp