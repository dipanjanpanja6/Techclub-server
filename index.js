const express =require('express')
const cross=require('cors')
const useragent=require('express-useragent')
const fileUpload=require('express-fileupload')
const http=require('http')
const bodyParser=require('body-parser')
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT||7000;

var app = express()
app.use(cross({origin:"https://techclub.web.app" ,credentials: true})); 
// app.use(cross({origin:"http://localhost:3000" ,credentials: true}));
// app.use(cross())
// app.use(express.json());
// app.use(bodyParser())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser("o vai maro mujhe maro"));


const {login,checkLogin,signUp,customLogin,activate} =require('./auth')
const {feedback} =require('./inq')

app.post('/feedback',feedback)

app.post('/signUp',signUp)
app.post('/login',login)
app.post('/activate',activate)
app.post('/customLogin',checkLogin,customLogin)

app.listen(PORT);