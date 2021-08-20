const io = require("./index");
const { admin } = require("./config/admin");
const random_id = require("random-id");
var dateFormat = require("dateformat");

var now = new Date();
var dates = dateFormat(now, "ddd");
var times = dateFormat(now, " h:MM TT");

module.exports = (socket) => {
  console.log("connect");

  ///seconde load
  // io.io.emit('io', 'emio')
  // socket.emit('em', 'em')
  // socket.broadcast.emit('br','br')
  //......................... first load

  socket.on("login", (d) => {
    // first come
    console.log("login");

    admin
      .firestore()
      .collection("SoutBox")
      .orderBy("createdAt", "asc")
      .limit(300)
      .get()
      .then((response) => {
        let msg = [];

        response.forEach((doc) => {
          msg.push(doc.data());
        });
        if (msg.length == 0) {
          // console.log(msg);
          // socket.emit('shouts', "0")
        } else {
          // console.log(msg)
          socket.emit("shouts", msg);
        }
        msg = [];

        // Socket.emit('rcvMsg', { msg })
      })
      .catch((err) => console.error(err));
    // console.log(d);
  });
  socket.on("send_shout", ({ message, uid, name }) => {
    // first come
    console.log(name);

    io.io.of("/shoutBox").emit("message", { message, name, uid, dates, times });

    addSoutBox(message, uid, name);
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });
};

const addSoutBox = (msg, uid, name) => {
  const id = random_id(20, "aA0");
  const data = {
    message: msg,
    uid: uid,
    createdAt: new Date().toISOString(),
    id: id,
    name: name,
    dates: dates,
    times: times,
  };
  admin
    .firestore()
    .doc(`/SoutBox/${id}`)
    .set(data)
    .catch((err) => console.error(err));
};
