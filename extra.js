const { admin } = require("./config/admin");
const firebase = require("firebase");
const randomId = require("random-id");

exports.getProjectByID = (req, res) => {
  const id = req.params.id;

  admin
    .firestore()
    .collection("project")
    .where("id", "==", id)
    .limit(1)
    .get()
    .then((d) => {
      if (d.empty) {
        return res.json({ error: true, message: "No data exist !" });
      } else {
        d.forEach((doc) => {
          return res.json({ success: true, data: doc.data() });
        });
      }
    })
    .catch((error) => {
      console.error(error);
      return res.json({ error: true, message: error });
    });
};

exports.TopProject = (req, res) => {
  admin
    .firestore()
    .collection("project")
    .where("active", "==", true)
    .orderBy("star", "desc")
    .limit(3)
    .get()
    .then(async (d) => {
      let project = [];
      await d.forEach((doc) => {
        project.push(doc.data());
      });
      return res.json({ success: true, data: project });
    })
    .catch((error) => {
      console.error(error);
      return res.json({
        error: true,
        message:
          error.code == 14 ? "Server offline! Contact team" : error.message,
      });
    });
};
exports.AllProject = (req, res) => {
  admin
    .firestore()
    .collection("project")
    .where("active", "==", true)
    .orderBy("createdAt", "asc")
    .get()
    .then(async (d) => {
      let project = [];
      await d.forEach((doc) => {
        project.push(doc.data());
      });
      return res.json({ success: true, data: project });
    })
    .catch((error) => {
      console.error("allproject", error);
      return res.json({ error: true, message: error });
    });
};
//////////////////////////////////
exports.AllEvent = (req, res) => {
  admin
    .firestore()
    .collection("events")
    .get()
    .then(async (data) => {
      let past = [];
      let future = [];
      await data.forEach((doc) => {
        new Date(Date.parse(doc.data().time)) > new Date()
          ? future.push(doc.data())
          : past.push(doc.data());
      });
      return res.json({ past: past, future: future, success: true });
    })
    .catch((error) => {
      console.error(error);
      return res.json({ error: true, message: error });
    });
};
exports.getEventByID = (req, res) => {
  const id = req.params.id;
  admin
    .firestore()
    .collection("events")
    .where("member", "array-contains", id)
    .get()
    .then(async (data) => {
      let allEvents = [];

      await data.forEach((doc) => {
        allEvents.push(doc.data());
      });

      return res.json({ data: allEvents, success: true });
    })
    .catch((error) => {
      console.error(error);
      return res.json({ error: true, message: error });
    });
};
//////////////////////////////////////
exports.faq = (req, res) => {
  admin
    .firestore()
    .collection("faq")
    .get()
    .then(async (data) => {
      let faqData = [];
      await data.forEach((doc) => {
        faqData.push(doc.data());
      });
      return res.json({ data: faqData, success: true });
    })
    .catch((error) => {
      console.error("faq get error ", error);
      return res.json({
        error: true,
        message:
          error.code == 14 ? "Server offline! Contact team" : error.message,
      });
    });
};
exports.SubmitFaq = (req, res) => {
  if (req.body.key === 4650) {
    admin
      .firestore()
      .collection("faq")
      .doc()
      .set({
        title: req.body.title,
        desc: req.body.desc,
        createdAt: new Date().toLocaleString(),
        topic: req.body.topic,
        id: randomId(10, "Aa0"),
        tag: req.body.tag,
      })
      .then(() => {
        return res.json({ success: true });
      })
      .catch((error) => {
        console.error("faq post error ", error);
        return res.json({
          error: true,
          message:
            error.code == 14 ? "Server offline! Contact team" : error.message,
        });
      });
  } else {
    return res.send({
      error: true,
      message: "you are fool! get outta here 😠 ",
    });
  }
};
