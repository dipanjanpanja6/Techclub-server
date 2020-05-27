const express = require('express')
const cross = require('cors')
const useragent = require('express-useragent')
const fileUpload = require('express-fileupload')
const http = require('http')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 7000;

var app = express()
app.use(cross({origin:"https://techclub.web.app" ,credentials: true})); 
// app.use(cross({ origin: "http://localhost:3000", credentials: true }));
// app.use(cross())
// app.use(express.json());
// app.use(bodyParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser("o vai maro mujhe maro"));

const socketManneger = require('./soutBox')
const { login, checkUser, checkCustomUser, createCookies, signUp, customLogin, activate } = require('./auth')
const { feedback } = require('./inq')

// ||||||||||||||||||||inquiry|||||||||||||||||||||
app.post('/feedback', feedback)

// ||||||||||||||||||||auth||||||||||||||||||||||||
app.post('/signUp', signUp, createCookies)
app.post('/login', login, createCookies)
app.post('/activate', checkUser, activate)
app.post('/customLogin', checkCustomUser, customLogin, createCookies)

app.post('/checkUser', checkUser, (req, res) => {
    return res.json({ success: true })
})
app.post('/logout', (req, res) => {
    res.clearCookie('token');
    // res.redirect('/login');
    return res.json({ success: true })
})
//////////////////////////////////////////////////////
const {userList,events,userProfile,projectSubmit,projectGet,addEvent} =require('./user')

app.get('/whoiam',checkUser,userProfile)
app.post('/projectsubmit',checkUser,projectSubmit)
app.get('/projectget',checkUser,projectGet)
app.get('/userlist',checkUser,userList)
app.get('/events',checkUser,events)
app.post('/addevent',checkUser,addEvent)



// ..(..)..///////////////////testing///////////////////--........
const L = (req, res, next) => {
    var str = "Hello step 1"
    console.log('step1');

    req.step1 = str;
    req.user = ({ str: "strr", john: 'dube mor' })
    return next()
}
const O = (req, res, next) => {
    console.log('step2');
    // console.log(req.user);
    return res.json(req.user)
    var strr = req.step1
    req.user = strr
    // return next()
    // return res.json({str:strr})
}
const P = (req, res, next) => {
    console.log('step3');
    return res.json(req.user)
}

app.get('/l', checkUser, O, P)

//////////////  //////  /////////////  ////////////////////////


const server = http.createServer(app)
const io = module.exports.io = require('socket.io')(server)
io.of('/shoutBox').on('connection', socketManneger)

server.listen(PORT);


process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
  });