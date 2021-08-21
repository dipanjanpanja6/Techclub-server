const admin = require("firebase-admin")
const firebase = require("firebase")
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE,
  projectId: "techclubgcect",
  storageBucket: "techclubgcect.appspot.com",
  messagingSenderId: "200360092473",
  appId: process.env.FIREBASE_API_ID,
  measurementId: process.env.FIREBASE_MEASUREMENTID,
}
firebase.initializeApp(firebaseConfig)

var serviceAccount = JSON.parse(process.env.FIREBASE_CREDS)
if (!serviceAccount) throw new Error("The $GOOGLE_AUTH_JSON environment variable was not found!")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE,
})

module.exports = { admin }
