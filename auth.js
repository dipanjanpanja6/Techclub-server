const { admin } = require('./config/admin')
const firebase = require('firebase')
const randomId = require('random-id')
const cookieConfig = {
  httpOnly: true, // to disable accessing cookie via client side js
  // secure: true, // to force https (if you use it)
  maxAge: 1000000000, // ttl in ms (remove this option and cookie will die when browser is closed)
  signed: true // if you use the secret with cookieParser
};

exports.signUp = (req, res, next) => {
  const email = req.body.email
  const pass = req.body.pass
  const name = req.body.name
  console.log(email, pass);

  if (email == "" || pass == "") return res.json({ error: true, message: "First input your credential" })
  firebase.auth().createUserWithEmailAndPassword(email, pass).then(d => {
    console.log(d.user.uid);
    admin.firestore().doc(`/users/${d.user.uid}`).set({
      name,
      email,
      createdAt: new Date().toISOString(),
      uid: d.user.uid,
      isActivated: false,
      // verified: req.body.verified,

    })
    firebase.auth().currentUser.getIdToken()
      .then((idToken) => {
        // res.cookie('token', "Bearer " + idToken, cookieConfig);
        req.token = idToken
        req.user = ({ uid: d.user.uid, email: email, name: name, isActivated: false, success: true })
        return next();

      })
      .catch((error) => {
        console.log(error);
        return res.json({ error: true, message: error })
      });
  }).catch(function (error) {
    console.log(error);

    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/weak-password') {
      return res.json({ error: true, message: 'The password is too weak. Use minimum 6 digit' });
    } else {
      return res.json({ error: true, message: errorMessage });
    }

  });



}
exports.login = (req, res, next) => {
  const email = req.body.email
  const pass = req.body.pass
  console.log(email, pass);

  if (email == "" || pass == "") return res.json({ error: true, message: "First input your credential" })
  firebase.auth().signInWithEmailAndPassword(email, pass).then(d => {

    firebase.auth().currentUser.getIdToken()
      .then((idToken) => {
        console.log(d.user.uid);

        // res.cookie('token', "Bearer " + idToken, cookieConfig);
        admin.firestore().collection('users').where('uid', '==', d.user.uid).limit(1).get().then(data => {
          if (data.empty) {
            admin.firestore().doc(`/users/${d.user.uid}`).set(email);
            req.user = ({ uid: d.user.uid, email: d.user.email, success: true, isActivated: false })
            req.token = idToken
            return next()
          } else {

            req.user = ({ isActivated: data.docs[0].data().isActivated, name: data.docs[0].data().name, email: data.docs[0].data().email, uid: d.user.uid, success: true })
            req.token = idToken
            return next()
          }
        })

      })
      .catch((error) => {
        console.log(error);
        return res.json({ error: true, message: error })
      });

  }).catch(function (error) {
    console.log(error);
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/weak-password') {
      return res.json({ error: true, message: 'The password is too weak.' });
    } else {
      return res.json({ error: true, message: errorMessage });
    }
  });


}
exports.customLogin = async (req, res, next) => {
  const idToken = req.token;
  const data = {
    isNewUser: req.body.isNewUser,
    name: req.body.name,
    email: req.body.email,
    verified: req.body.verified,
    userImage: req.body.userImage,
    uid: req.body.uid,
    isActivated: false,
    // phoneNumber: req.body.phoneNumber,
    createdAt: new Date().toISOString(),
  }
  if (data.isNewUser == true) {
    admin.firestore().doc(`/users/${data.uid}`).set(data);
    req.token = idToken
    req.user = ({ uid: data.uid, name: data.name, email: data.email, isActivated: false, success: true })
    return next();

    // admin.firestore().collection("users").where("user_id", "==", user_id).limit(1).get()
    //   .then((doc) => {
    //     if (doc.docs[0]) {
    //       return 0;
    //     } else {
    //       return admin.firestore().doc(`/users/${user_id}`).set(data);
    //     }
    //   });
  } else if (data.isNewUser == false) {
    admin.firestore().collection('users').where('uid', '==', data.uid).limit(1).get().then(d => {
      if (d.empty) {
        console.log("data not found" + data.uid);

        admin.firestore().doc(`/users/${data.uid}`).set(data);
        req.user = ({ uid: data.uid, name: data.name, email: data.email, success: true, isActivated: false })
        req.token = idToken
        return next()
      } else {
        req.token = idToken
        req.user = ({ isActivated: d.docs[0].data().isActivated, name: data.name, email: data.email, uid: data.uid, success: true })
        return next()
      }

    })
  }
  console.log(data.isNewUser);


};
exports.activate = (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    date: req.body.date,
    address: req.body.address,
    Ph: req.body.Ph,
    clg: req.body.clg,
    isActivated: true,
    // uid:req.body.uid

  }
  // console.log(data);
  console.log(req.body.uid);
  const myTestCookie = req.signedCookies.token;

  console.log('156' + myTestCookie);
  try {
    admin.firestore().doc(`/users/${req.body.uid}`).update(data);
    return res.json({ success: true })
  } catch (e) {
    console.log(e);
    return res.json({ error: true, message: e })
  }
}
exports.checkCustomUser = (req, res, next) => {
  const myTestCookie = req.headers.authorization;
  let idToken;
  if (
    myTestCookie &&
    myTestCookie.startsWith("Bearer ")
  ) {
    idToken = myTestCookie.split("Bearer ")[1];
  } else {
    return res.status(403).json({ error: true, message: "Unauthorized access token", authorized: false });
  }
  console.log(idToken);

  admin.auth().verifyIdToken(idToken).then(function (decodedToken) {
    req.token = idToken
    return next()
  }).catch(function (error) {
    console.log('error while verifing token');
    return res.status(403).json({ error: true, message: error });

  });
}
exports.createCookies = (req, res) => {

  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 14 * 1000;
  const idToken = req.token
  const user = req.user
  admin.auth().createSessionCookie(idToken, { expiresIn })
    .then((sessionCookie) => {

      // Set cookie policy for session cookie.
      const options = { maxAge: expiresIn, httpOnly: true, signed: true };
      res.cookie('token', sessionCookie, options);
      console.log('cookies set');

      return res.json(user)
      // res.end(JSON.stringify({ status: 'success' }));
    }, error => {
      console.log(error);

      return res.status(401).json({ error: true, message: 'REQUEST FAILED! UNAUTHORIZED  );' });
    });
}
exports.checkUser = (req, res, next) => {

  const sessionCookie = req.signedCookies.token || '';
  // console.log(sessionCookie);

  admin.auth().verifySessionCookie(
    sessionCookie, true /** checkRevoked */)
    .then((decodedClaims) => {
      req.uid=(decodedClaims.uid)
      
      next()
    })
    .catch(error => {
      console.log(error);
      return res.json({ error: true, message: error.code })
    });
}

