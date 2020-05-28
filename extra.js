const { admin } = require('./config/admin')
const firebase = require('firebase')
const randomId = require('random-id')


exports.getProjectByID = (req, res) => {
    const id = req.params.id
    console.log(id);
    
    admin.firestore().collection('project').where('id', '==', id).limit(1).get().then(d => {
        // console.log(d.docs.data())
        if (d.empty) {
            return res.json({ error: true, message: "No data exist !" })
        } else {
            d.forEach(doc=>{
                console.log(doc.data())
                return res.json({ success: true, data: doc.data() })
            })
        }
    }).catch((error) => {
        console.log(error);
        return res.json({ error: true, message: error })
    }) 
}

exports.TopProject = (req, res) => {

    admin.firestore().collection('project').orderBy('star', 'asc').limit(3).get().then(async d => {
        // console.log(d);
        let project = [];
        await d.forEach(doc => {
            project.push(doc.data())
            // console.log(doc.data());
        })
        return res.json({ success: true, data: project })
    }).catch((error) => {
        console.log(error);
        return res.json({ error: true, message: error })
    })
}
exports.AllProject = (req, res) => {

    admin.firestore().collection('project').orderBy('createdAt', 'asc').get().then(async d => {
        // console.log(d);
        let project = [];
        await d.forEach(doc => {
            project.push(doc.data())
            console.log(doc.data());

        })
        return res.json({ success: true, data: project })
    }).catch((error) => {
        console.log(error);
        return res.json({ error: true, message: error })
    })
}
//////////////////////////////////
exports.AllEvent = (req, res) => {

    admin.firestore().collection("events").get().then(async data => {
        let past = [];
        let future = [];
        await data.forEach(doc => {
            new Date(Date.parse(doc.data().time)) > new Date() ? future.push(doc.data()) : past.push(doc.data())
        })
        return res.json({ past: past, future: future, success: true })
    }).catch((error) => {
        console.log(error);
        return res.json({ error: true, message: error })
    })

}
exports.getEventByID = (req, res) => {
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
