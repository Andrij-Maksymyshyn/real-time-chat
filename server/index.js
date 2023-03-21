const express = require("express");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const route = require("./routes/route");
const {
  addUser,
  findUser,
  getRoomUsers,
  removeUser
} = require("./users/users");

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

    const { user, isUserExist } = addUser({ name, room });

    const userMessage = isUserExist
      ? `${user.name}, here you are again`
      : `Hey dear, ${user.name}`;

    socket.emit("message", {
      data: {
        user: { name: "Admin" },
        message: userMessage
      }
    });

    socket.broadcast.to(user.room).emit("message", {
      data: {
        user: { name: "Admin" },
        message: `${user.name} has joined`
      }
    });

    io.to(user.room).emit("room", {
      data: {
        users: getRoomUsers(user.room)
      }
    });
  });

  socket.on("sendMessage", ({ message, params }) => {
    const user = findUser(params);

    if (user) {
      io.to(user.room).emit("message", { data: { user, message } });
    }
  });

  socket.on("leftRoom", ({ params }) => {
    const user = removeUser(params);

    if (user) {
      io.to(user.room).emit("message", {
        data: {
          user: { name: "Admin" },
          message: `${user.name} has left room: ${user.room}`
        }
      });

      io.to(user.room).emit("room", {
        data: {
          users: getRoomUsers(user.room)
        }
      });
    }
  });

  io.on("disconnect", () => {
    console.log("Disconnect");
  });
});

const { PORT = 5000 } = process.env;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
