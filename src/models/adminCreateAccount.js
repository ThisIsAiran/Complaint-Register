const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validatePhoneNo = require('validate-phone-number-node-js')
const adminSignUpSchema = new mongoose.Schema({
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
	hostel:{
			type: String,
			required: true
	},
	tokens:[{
		token:{
			type:String,
			required: true
		}
	}],
})


adminSignUpSchema.methods.generateAuthToken = async function(){
	const adminData = this
	// console.log(adminData)
	const token = jwt.sign({_id:adminData._id.toString()}, "thisisnodecourse")
	adminData.tokens = adminData.tokens.concat({token})
	await adminData.save()
	return token
}	

adminSignUpSchema.statics.findByCredentials = async (email, password)=>{
	const adminData = await adminSignUp.findOne({email})
	if(!adminData){
		throw new Error("Unable to login")
	}
	const isMatch = await bcrypt.compare(password, adminData.password)
	if(!isMatch)
	{
		throw new Error("Unable to login")
	}
	return adminData
}

adminSignUpSchema.pre('save', async function(next){
	const adminData = this
	if(adminData.isModified('password'))
		adminData.password = await bcrypt.hash(adminData.password, 8)
	next()
})

const adminSignUp = mongoose.model('adminSignUp', adminSignUpSchema)
module.exports = adminSignUp