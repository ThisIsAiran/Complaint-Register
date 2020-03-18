const express = require('express')
const ejs = require('ejs')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 3200
const urlencodedParser = bodyParser.urlencoded({ extended: false})
const partialsPath = path.join(__dirname, '../templates/partials')
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
app.use(express.static(publicDirectoryPath))
app.set('view engine', 'ejs');
app.set('views',viewsPath);

// Including mongoode file 
require('./db/mongoose.js')	
const studentRouter = require('./routers/student.js')
const adminRouter = require('./routers/admin.js')

//for getting home.ejs when any get request from client on route / 
app.get('/',(req, res)=>{
	res.render('home')
})


app.use(express.json())
app.use(studentRouter)
app.use(adminRouter)

app.listen(port, ()=>{
	console.log("Server is on port " + port)
})