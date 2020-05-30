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
    const email = req.email
    // console.log(req);

    const data = {
        id: randomId(10, 'Aa0'),
        uid: uid,
        email: email,
        title: req.body.title,
        gitLink: req.body.gitLink,
        desc: req.body.desc,
        imageUri: req.body.imageUri,
        liveLink: req.body.liveLink,
        createdAt: new Date().toLocaleString(),
        star: 0,
        member: [uid],
        tag: req.body.tag,
        status: req.body.status,
        active: req.body.active
    }
    // console.log(data);
    console.log(data.tag);
    // console.log(req.body.tag);


    var object = {}
    object['projectKey ' + randomId(5, 'Aa0')] = data

    admin.firestore().collection('project').doc().set(data).then(d => {

        return res.json({ success: true })
    }).catch((error) => {
        console.log(error);
        return res.json({ error: true, message: error })
    })
}
exports.projectGet = (req, res) => {
    const uid = req.uid

    admin.firestore().collection("project")
        .where("uid", "==", uid).get().then(async d => {
            let data = []
            await d.forEach(doc => {
                data.push(doc.data())
            })

            return res.json({ success: true, data: data })

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
        admin.firestore().collection("users").orderBy("name", "asc").get().then(async data => {
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
    // let member = {}
    // member[uid] = email
    const data = {
        id: randomId(10, 'Aa0'),
        title: req.body.title,
        gitLink: req.body.gitLink,
        desc: req.body.desc,
        time: req.body.time,
        place: req.body.place,
        topic: req.body.topic,
        createdAt: new Date().toLocaleString(),
        member: [uid],
        uid: uid
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
exports.userEvents = (req, res) => {
    const id = req.uid
    admin.firestore().collection("events")
        .where("member", "array-contains", id).get().then(async data => {


            let past = [];
            let future = [];
            await data.forEach(doc => {
                new Date(Date.parse(doc.data().time)) > new Date() ? future.push(doc.data()) : past.push(doc.data())
            })
            return res.json({ past: past, future: future, success: true })
            // allEvents.push(doc.data())
            // console.log(doc.id, '=>', doc.data());

            return res.json({ data: allEvents, success: true })
        }).catch((error) => {
            console.log(error);
            return res.json({ error: true, message: error })
        })
}
exports.getEventByUID = (req, res) => {
    // const uid = req.uid
    const id = req.params.id
    admin.firestore().collection("events")
        .where("member", "array-contains", id).get().then(async data => {
            let allEvents = [];


            await data.forEach(doc => {
                allEvents.push(doc.data())
                // console.log(doc.id, '=>', doc.data());
            })

            return res.json({ data: allEvents, success: true })
        }).catch((error) => {
            console.log(error);
            return res.json({ error: true, message: error })
        })

}
exports.getProjectByUID = (req, res) => {
    const uid = req.params.id

    admin.firestore().collection('project').where('uid', '==', uid).get().then(async d => {
        let data = []
        await d.forEach(doc => {
            data.push(doc.data())
        })
        return res.json({ success: true, data: data })


    }).catch((error) => {
        console.log(error);
        return res.json({ error: true, message: error.code==14 ?"Server offline! Contact team" :error.message })
    })

}
exports.getUserByUID = (req, res) => {
    const uid = req.uid
    const id = req.params.id

    admin.firestore().collection('users').where('uid', '==', id).limit(1).get().then(data => {
        if (data.empty) {
            console.log('user not exist ');

            return res.json({ error: true, message: 'User does not exist' })
        } else {
            return res.json({ data: data.docs[0].data(), success: true })
        }
    })

        .catch((error) => {
            console.log(error);
            return res.json({ error: true, message: error })
        })

}