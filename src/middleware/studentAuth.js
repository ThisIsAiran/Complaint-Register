const jwt = require('jsonwebtoken')
const studentSignUp = require('../models/studentCreateAccount.js')

const auth = async (req, res, next)=>{
	try{
		const token = req.params.token
		console.log("token is: ",token)
		const decode = jwt.verify(token, 'thisisnodecourse')
		const studentData = await studentSignUp.findOne({_id: decode._id, 'tokens.token': token})
		if(!studentData)
			throw new Error()
		req.token = token
		req.studentData = studentData
		next()
	}
	catch(e){
		res.redirect('/studentAccount')
	}
}
module.exports = auth