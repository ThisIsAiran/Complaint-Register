const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const studentSignUp = require('../models/studentCreateAccount.js')
const adminSignUp = require('../models/adminCreateAccount.js')
const auth = require('../middleware/adminAuth')
const router = new express.Router()
const urlencodedParser = bodyParser.urlencoded({extended: false})

// get request for admin login and register
router.get('/adminAccount',(req, res)=>{
	res.render('adminAccount')
})
//// get request to get to admin platform
router.get('/admin/signUp',(req, res)=>{
	res.render('adminSignUp')
})
//get request to get admin login page
router.get('/admin/logIn',(req, res)=>{
	res.render('adminLogIn')
})

//post request to register
router.post('/admin/signUp', urlencodedParser, async (req, res)=>{
	console.log(req.body)
	const adminData = new adminSignUp(req.body)
	try{
		await adminData.save()
		const token  = await adminData.generateAuthToken()
		res.redirect('admin/dashboard/'+token)
	}
	catch(e)
	{
		res.status(400).send(e)
	}
})

//post request for login
router.post('/admin/logIn',urlencodedParser, async(req, res)=>{
	try{
			console.log(req.body)
			const adminData = await adminSignUp.findByCredentials(req.body.email, req.body.password)
			const token =  await adminData.generateAuthToken()
			res.redirect('/admin/dashboard/'+token)
	}
	catch(e){
		res.status(400).send(e)
	}
})
//post request for show dashboard
router.get('/admin/dashboard/:token', urlencodedParser, auth, async(req, res)=>{

	const studentData = await studentSignUp.find({adminId:req.adminData._id})
			console.log(studentData[0].complaints)
			let adminRecivedComplaint = {
					admin:[studentData,req.params.token,req.adminData]
			}
			res.render('adminDashboard',{ adminRecivedComplaint:adminRecivedComplaint })
})

//post request sending response to student by admin
router.post('/admin/dashboard/:_id/:index/:token',urlencodedParser,async (req, res)=>{
	try{
		const _id = req.params._id
		const updatedStudentData = await studentSignUp.findById(_id)
		updatedStudentData.complaints[req.params.index].answer = req.body.answer
		updatedStudentData.complaints[req.params.index].status = req.body.radio
		await updatedStudentData.save()
		res.redirect('/admin/dashboard/'+req.params.token)
	}
	catch(e){
		res.status(400).send(e)
	}
})
// post request for logout 
router.post('/admin/logout/:token',urlencodedParser,auth, async(req, res)=>{
	try{
			req.adminData.tokens = req.adminData.tokens.filter((token)=>{
				return token.token!= req.token
			})
			await req.adminData.save()
			res.redirect('/adminAccount')
	}
	catch(e){
			res.status(500).send(e)
	}
})
module.exports = router