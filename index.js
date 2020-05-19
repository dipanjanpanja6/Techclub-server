const express =require('express')
const cross=require('cors')
const useragent=require('express-useragent')
const fileUpload=require('express-fileupload')
const http=require('http')
const bodyParser=require('body-parser')

const PORT = process.env.PORT||7000;

var app = express()
app.use(cross({origin:"https://techclub.web.app" ,credentials: true}));
// app.use(cross())
app.use(express.json());
// app.use(bodyParser())
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());


const {login,gLogin,signUp} =require('./auth')

app.post('/signUp',signUp)
app.post('/login',login)
app.post('/login/:token',gLogin)

app.listen(PORT);