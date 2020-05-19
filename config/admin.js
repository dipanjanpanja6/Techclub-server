const admin = require('firebase-admin')
const firebase =require('firebase')
const firebaseConfig = {
    apiKey: "AIzaSyAHq0pb8nDiPqcVIkFZNHPqc0wJsi2nWR8",
    authDomain: "techclubgcect.firebaseapp.com",
    databaseURL: "https://techclubgcect.firebaseio.com",
    projectId: "techclubgcect",
    storageBucket: "techclubgcect.appspot.com",
    messagingSenderId: "200360092473",
    appId: "1:200360092473:web:4ec0d97fe1f03d0a6ffee8",
    measurementId: "G-KK083XRQ6P"
  };
  firebase.initializeApp(firebaseConfig)

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://techclubgcect.firebaseio.com"
});


  module.exports={admin}