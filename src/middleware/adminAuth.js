const jwt = require('jsonwebtoken')
const adminSignUp = require('../models/adminCreateAccount.js')
const auth = async (req, res, next)=>{
	try{
		const token = req.params.token
		console.log("token is: ",token)
		const decode = jwt.verify(token, 'thisisnodecourse')
		const adminData = await adminSignUp.findOne({_id: decode._id, 'tokens.token': token})
		if(!adminData)
			throw new Error()
		req.token = token
		req.adminData = adminData
		next()
	}
	catch(e){
		res.status(401).send("Please Authenticate")
	}
}
module.exports = auth