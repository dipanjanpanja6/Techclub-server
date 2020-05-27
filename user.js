const { admin } = require('./config/admin')
const firebase = require('firebase')
const randomId = require('random-id')

exports.userProfile = (req, res) => {
    const uid = req.uid
    admin.auth().getUser(uid).then((userRecord) => {
        console.log(userRecord);

        admin.firestore().collection('users').where('uid', '==', uid).limit(1).get().then(data => {
            if (data.empty) {
                return res.json({ error: true })
            } else {
                return res.json({ data: data.docs[0].data(), success: true })
            }
        })

            .catch((error) => {
                console.log(error);
                return res.json({ error: true, message: error })
            })
    })

        .catch(err => {
            console.log(err);

        })
}
exports.projectSubmit = (req, res) => {
    const uid = req.uid
    const data = {
        title: req.body.title,
        gitLink: req.body.gitLink,
        desc: req.body.desc,
        imageUri: req.body.imageUri,
        liveLink: req.body.liveLink,
        createdAt: new Date().toLocaleString()
    }
    console.log(data);
    
    var object = {}
    object['projectKey '+randomId(5, 'Aa0')] = data

    admin.firestore().collection('project').doc(uid).set(object,{merge: true}).then(d => {

        return res.json({ success: true })
    })

        .catch((error) => {
            console.log(error);
            return res.json({ error: true, message: error })
        })


        .catch(err => {
            console.log(err);
            return res.json({ error: true, message: error })

        })
}
exports.projectGet = (req, res) => {
    const uid = req.uid

    admin.firestore().collection('project').doc(uid).get().then(d => {
        if(!d.exists){
            return res.json({ success: true,data:{title:'No project added'} })
        }else{
            console.log(d.data());
            
            return res.json({ success: true,data:d.data() })

        }
    })

        .catch((error) => {
            console.log(error);
            return res.json({ error: true, message: error })
        })


        .catch(err => {
            console.log(err);
            return res.json({ error: true, message: error })

        })
}