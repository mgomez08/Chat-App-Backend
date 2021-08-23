const { userConnect, userDisconnect } = require("../controllers/sockets");
const { checkJWT } = require("../helpers/jwt");

class Sockets {
  constructor(io) {
    this.io = io;
    this.socketEvents();
  }
  socketEvents() {
    //On Connection
    this.io.on("connection", async (socket) => {
      //Listen Event: newMessage
      const [checked, uid] = checkJWT(socket.handshake.query["x-token"]);
      if (!checked) {
        console.log("Socket no identificado");
        return socket.disconnect();
      }
      await userConnect(uid);
      console.log("Cliente conectado ", uid);
      socket.on("disconnect", async () => {
        await userDisconnect(uid);
        console.log("Cliente desconectado", uid);
      });
    });
  }
}

module.exports = Sockets;
