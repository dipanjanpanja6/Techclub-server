const { admin } = require('./config/admin')
const firebase = require('firebase')
const randomId =require('random-id')
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

exports.gLogin = async(req, res) => {
    const tokena = req.params.token;
    var credential = firebase.auth.GoogleAuthProvider.credential(tokena);
    let user_id;
    let token = "";
    let data = {};
    firebase.auth().signInWithCredential(credential)
      .then((d) => {
        user_id = d.user.uid;
        data = {
          name: randomId(8, "A0"),
          displayName: d.user.displayName,
          email: d.user.email,
          createdAt: new Date().toISOString(),
          user_id: d.user.uid,
          isAnonymous: d.user.isAnonymous,
          userImage: d.user.photoURL,
          // lastLogin: d.user.lastLoginAt,
        };
        // console.log(d.user.displayName);
        return d.user.getIdToken();
        
      })
      .then((tokens) => {
        token = tokens;
        admin.firestore().collection("users").where("user_id", "==", user_id).limit(1).get()
          .then((doc) => {
            if (doc.docs[0]) {
              return 0;
            } else {
              return admin.firestore().doc(`/users/${user_id}`).set(data);
            }
          });
      })
      .then(() => {
        const device_key = randomId(24, "aA0");
        res.cookie('token', token, cookieConfig);
        return res
          .status(200)
          .json({ token, user_id, device_key, success: true });
      })
  
      .catch((error) => {
        console.log(error);
        return res.status(403).json({ error: true, message: error.message });
      });
}