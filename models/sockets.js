const {
  userConnect,
  userDisconnect,
  getUsers,
  saveMessage,
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
      socket.join(uid);
      console.log("Cliente conectado ", uid);
      socket.on("personal-message", async (payload) => {
        const message = await saveMessage(payload);
        this.io.to(payload.to).emit("personal-message", message);
        this.io.to(payload.from).emit("personal-message", message);
      });
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
