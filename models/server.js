const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const Sockets = require("./sockets");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8080;

    //Connect to debugger
    dbConnection();

    //http Server
    this.server = http.createServer(this.app);

    //config sockets
    this.io = socketio(this.server);
  }
  middlewares() {
    this.app.use(express.static(path.resolve(__dirname, "../public")));
    //CORS
    this.app.use(cors());
    this.app.use(express.json());
    //API endpoints
    this.app.use("/api/auth", require("../router/auth"));
    this.app.use("/api/messages", require("../router/messages"));
  }
  configSockets() {
    new Sockets(this.io);
  }
  execute() {
    //init Middlewares
    this.middlewares();
    //init Sockets
    this.configSockets();
    //init Server
    this.server.listen(this.port, () => {
      console.log("Server corriendo en el puerto: " + this.port);
    });
  }
}

module.exports = Server;
