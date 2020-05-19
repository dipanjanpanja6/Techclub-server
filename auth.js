const { admin } = require('./config/admin')
const firebase = require('firebase')
const cookieConfig = {
    httpOnly: true, // to disable accessing cookie via client side js
    secure: true, // to force https (if you use it)
    maxAge: 1000000000, // ttl in ms (remove this option and cookie will die when browser is closed)
    // signed: true // if you use the secret with cookieParser
  };

exports.signUp = async (req, res) => {
    const email = req.body.email
    const pass = req.body.pass
    console.log(email, pass);

    if (email == "" || pass == "") return res.json({ error: true, message: "First input your credential" })
    var user = await firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
            return res.json({ error: true, message: 'The password is too weak.' });
        } else {
            return res.json({ error: true, message: errorMessage });
        }
        console.log(error);
        // ...
    });
    console.log(user);
    return res.json({ token: user.user.getIdToken(), success: true })

}

exports.login = async (req, res) => {
    const email = req.body.email
    const pass = req.body.pass
    console.log(email, pass);

    if (email == "" || pass == "") return res.json({ error: true, message: "First input your credential" })
    const user = await firebase.auth().signInWithEmailAndPassword(email, pass).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
            return res.json({ error: true, message: 'The password is too weak.' });
        } else {
            return res.json({ error: true, message: errorMessage });
        }
    });
    await firebase.auth().currentUser.getIdToken()
    .then((idToken) => {
        res.cookie('token', idToken, cookieConfig);
        return res.json({ token: idToken, success: true })       
    })
    .catch((error) => {
        return res.json({ error: true, message: 'error' })
    });
    

}

exports.gLogin = (req, res) => {
    const token = req.params.token;

}