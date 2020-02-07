const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const studentSignUp = require('../models/studentCreateAccount.js')
const adminSignUp = require('../models/adminCreateAccount.js')
const auth = require('../middleware/studentAuth')
const router = new express.Router()
const urlencodedParser = bodyParser.urlencoded({ extended: false})

// get request to get to student platform
router.get('/studentAccount',(req, res)=>{
	res.render('studentAccount')
})
//get requets for getting signup page
router.get('/student/signUp',(req, res)=>{
	res.render('studentSignUp')
})
router.get('/student/logIn',(req, res)=>{
	res.render('studentLogIn')
})

//post request for signUp and redirect to the student dashboard
router.post('/student/signUp', urlencodedParser, async (req, res)=>{
	console.log(req.body)
	const studentData = new studentSignUp(req.body)
	try{
		const adminData = await adminSignUp.findOne({hostel:studentData.hostel})
		studentData.adminId = adminData._id
		await studentData.save()
		const token  = await studentData.generateAuthToken()
		res.redirect('/student/dashboard/'+token)
	}
	catch(e)
	{
		res.status(400).send(e)
	}
})

//post request for Login and redirect to the student dashboard
router.post('/student/logIn', urlencodedParser, async (req, res)=>{
	try{
		console.log(req.body)
		const studentData = await studentSignUp.findByCredentials(req.body.email, req.body.password)
		const token =  await studentData.generateAuthToken()
		res.redirect('/student/dashboard/'+token)
	}
	catch(e)
	{
		res.status(400).send(e)
	}
})

//post request to logout 
router.post('/student/logout/:token',urlencodedParser,auth, async(req, res)=>{
	try{
			req.studentData.tokens = req.studentData.tokens.filter((token)=>{
				return token.token!= req.token
			})
			await req.studentData.save()
			res.redirect('/studentAccount')
	}
	catch(e){
			res.status(500).send(e)
	}
})

//for creating new complaint and saving in database
router.post('/student/newComplaint/:token', auth, urlencodedParser,async (req, res)=>{
	try{
		req.studentData.complaints = req.studentData.complaints.concat({complaint:req.body.complaint,date:new Date()})
		await req.studentData.save()
		res.redirect('/student/dashboard/'+req.params.token)
		}
	catch(e){
 		res.status(400).send(e)
	}
})

// for deleting complaints from databases
router.get('/student/complaints/:token/:index',auth, urlencodedParser, async (req, res)=>{
	try{
		const deleteComplaint = {
		"index": req.params.index
	}
	for(var i=0;i<req.studentData.complaints.length;i++)
	{
		if(i == parseInt(deleteComplaint.index, 10))
			{
				req.studentData.complaints.splice(i,1)
			}
	}
	await req.studentData.save()
	res.redirect('/student/dashboard/'+req.params.token)
	}
	catch(e)
	{
		res.status(500).send(e)
	}
	
})

// get request to show dashboard  of student
router.get('/student/dashboard/:token', urlencodedParser, auth, async(req, res)=>{
		try{
			let studentComplaints = {
				student:[req.studentData,req.params.token]
			}
		res.render('studentDashboard',{studentComplaints:studentComplaints})
		}
		catch(e)
		{
			res.status(500).send(e)
		}
		
})


module.exports = router