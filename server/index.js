const express = require("express");
require("dotenv").config();
const http = require("http");
const EventEmitter = require("events");
const { Server } = require("socket.io");
const cors = require("cors");
const route = require("./routes/route");
const { addUser } = require("./users/users");

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
// increase the limit
myEmitter.setMaxListeners(25);

const app = express();

app.use(cors({ origin: "*" }));
app.use(route);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", socket => {
  socket.on("join", ({ name, room }) => {
    socket.join(room);

    const { user } = addUser({ name, room });

    socket.emit("message", {
      data: {
        user: { name: "Admin" },
        message: `Hey my love ${user.name}`
      }
    });

    socket.broadcast.to(user.room).emit("message", {
      data: { user: { name: "Admin" }, message: `${user.name} has joined` }
    });
  });

  io.on("disconnect", () => {
    console.log("Disconnect"); // the Set contains at least the socket ID
  });
});

const { PORT = 5000 } = process.env;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
