const {
  userConnect,
  userDisconnect,
  getUsers,
} = require("../controllers/sockets");
const { checkJWT } = require("../helpers/jwt");

class Sockets {
  constructor(io) {
    this.io = io;
    this.socketEvents();
  }
  socketEvents() {
    //On Connection
    this.io.on("connection", async (socket) => {
      //UserConnect and check your JWT
      const [checked, uid] = checkJWT(socket.handshake.query["x-token"]);
      if (!checked) {
        console.log("Socket no identificado");
        return socket.disconnect();
      }
      //User is connect
      await userConnect(uid);
      console.log("Cliente conectado ", uid);
      //Emit all users connected
      this.io.emit("users-list", await getUsers());
      //UserDisconnect
      socket.on("disconnect", async () => {
        await userDisconnect(uid);
        this.io.emit("users-list", await getUsers());
        console.log("Cliente desconectado", uid);
      });
    });
  }
}

module.exports = Sockets;
