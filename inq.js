const { admin } = require('./config/admin')
const random =require('random-id')


exports.feedback = (req, res) => {
    const email = req.body.email
    const name = req.body.name
    const msg = req.body.msg
    const key= random(5,'a')
       console.log(email);
       
    try {
    admin.firestore().collection('feedback').doc().set({
        email:email,
        name:name,
        data:msg
        }
    )
        return res.json({success:true})
    } catch (error) {
        console.log(error);
        
        return res.json({success:false})
        
    }

}