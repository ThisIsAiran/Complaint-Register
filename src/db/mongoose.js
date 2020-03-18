const mongoose = require('mongoose')
const validator = require('validator')
const connectionUrl = 'mongodb+srv://guptaaman70659:bitti0788@complaintregister-gtmwd.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(connectionUrl,{
	useNewUrlParser:true,
	useCreateIndex:true,
	useFindAndModify:false,
	useUnifiedTopology: true
})
