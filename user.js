const { admin } = require('./config/admin')
const firebase = require('firebase')
const randomId = require('random-id')

exports.userProfile = (req, res) => {
    const uid = req.uid
    admin.auth().getUser(uid).then((userRecord) => {
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
        id: randomId(10, 'Aa0'),
        title: req.body.title,
        gitLink: req.body.gitLink,
        desc: req.body.desc,
        imageUri: req.body.imageUri,
        liveLink: req.body.liveLink,
        createdAt: new Date().toLocaleString()
    }
    console.log(data);

    var object = {}
    object['projectKey ' + randomId(5, 'Aa0')] = data

    admin.firestore().collection('project').doc(uid).set(object, { merge: true }).then(d => {

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
        if (!d.exists) {
            return res.json({ success: true, data: { title: 'No project added' } })
        } else {
            return res.json({ success: true, data: d.data() })
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
exports.userList = (req, res) => {
    const uid = req.uid
    admin.auth().getUser(uid).then((userRecord) => {
        admin.firestore().collection("users").orderBy("class", "asc").get().then(async data => {
            let classA = [];
            let classB = [];
            let classC = [];
            await data.forEach(doc => {
                switch (doc.data().class) {
                    case 'classA':
                        // console.log(doc.data());
                        classA.push(doc.data())
                        break;
                    case 'classB':
                        // console.log(doc.data());
                        classB.push(doc.data())
                        break;
                    default:
                        // console.log(doc.data());
                        classC.push(doc.data())
                        break;
                }
                // console.log(doc.id, '=>', doc.data());
            })
            return res.json({ classA: classA, classB: classB, classC: classC, success: true })
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
exports.addEvent = (req, res) => {
    const uid = req.uid
    const email = req.email
    let member = {}
    member[uid] = email
    const data = {
        id: randomId(10, 'Aa0'),
        title: req.body.title,
        gitLink: req.body.gitLink,
        desc: req.body.desc,
        time: req.body.time,
        place: req.body.place,
        topic: req.body.topic,
        createdAt: new Date().toLocaleString(),
        member: [member]
    }
    console.log(data);
   
    admin.firestore().collection('events').doc().set(data, { merge: true }).then(d => {
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
exports.events = (req, res) => {
    const uid = req.uid
    admin.auth().getUser(uid).then((userRecord) => {
        admin.firestore().collection("events").get().then(async data => {
            let past = [];
            let future = [];
            // console.log(data.docs);
            
            await data.forEach(doc => {
                new Date(Date.parse(doc.data().time))> new Date() ? future.push(doc.data()) : past.push(doc.data())

                // console.log(doc.id, '=>', doc.data());
                console.log(new Date(Date.parse(doc.data().time))>new Date())
                console.log(new Date(Date.parse(doc.data().time)))
                console.log(new Date());
console.log(doc.data());


            })

            // console.log(classA,classB,classC);


            return res.json({ past: past, future: future, success: true })
        }).catch((error) => {
            console.log(error);
            return res.json({ error: true, message: error })
        })
    })

        .catch(err => {
            console.log(err);

        })
}