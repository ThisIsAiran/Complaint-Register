const mongoose = require('mongoose')
const validator = require('validator')
const connectionUrl = MONGODB_URI || 'mongodb://127.0.0.1:27017/Complaint-Register'
mongoose.connect(connectionUrl,{
	useNewUrlParser:true,
	useCreateIndex:true,
	useFindAndModify:false,
	useUnifiedTopology: true
})
