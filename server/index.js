const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const mainRouter = require("./routes/mainRouter");
const {
  addUser,
  findUser,
  getRoomUsers,
  removeUser
} = require("./users/users");
const { User } = require("./models");
const { NotFound } = require("./errors/ApiError");
const { SERVER_ERROR } = require("./errors/errorCodes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use("/", mainRouter);
app.use("*", notFoundError);
app.use(mainErrorHandler);

const { DB_HOST, PORT = 5000 } = process.env;

mongoose
  .set("debug", true)
  .set("strictQuery", true)
  .connect(DB_HOST)
  .then(() => console.log(`Database connection successful.`))
  .catch(error => {
    console.log(error.message);
    process.exit(1);
  });

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", socket => {
  socket.on("join", async ({ name, room }) => {
    socket.join(room);

    const { user, isUserExist } = addUser({ name, room });

    const newUser = User.create({
      userName: name,
      chatroom: room
    });

    const guest = await User.find({ userId: newUser._id });
    const userId = guest[guest.length - 1]?._id;

    const userMessage = isUserExist
      ? `${user.name}, here you are again`
      : `Hey dear, ${user.name}`;

    socket.emit("message", {
      data: {
        user: { name: "Admin" },
        message: userMessage,
        userId
      }
    });

    socket.broadcast.to(user.room).emit("message", {
      data: {
        user: { name: "Admin" },
        message: `${user.name} has joined`,
        userId
      }
    });

    io.to(user.room).emit("room", {
      data: {
        users: getRoomUsers(user.room)
      }
    });
  });

  socket.on(
    "sendMessage",
    async ({ message, params, userId, userJoinedId }) => {
      const user = findUser(params);

      if (user) {
        io.to(user.room).emit("message", { data: { user, message } });
      }

      await User.updateOne(
        { _id: userId },
        { $push: { messageField: message } }
      );

      await User.updateOne(
        { _id: userJoinedId },
        {
          $push: { messageField: message }
        }
      );
    }
  );

  socket.on("leftRoom", async ({ params, userId }) => {
    const user = removeUser(params);

    if (user) {
      io.to(user.room).emit("message", {
        data: {
          user: { name: "Admin" },
          message: `${user.name} has left room: ${user.room}`
        }
      });

      await User.findByIdAndDelete(userId);

      io.to(user.room).emit("room", {
        data: {
          users: getRoomUsers(user.room)
        }
      });
    }
  });

  socket.on("leftRoom", async ({ params, userJoinedId }) => {
    const user = removeUser(params);

    if (user) {
      io.to(user.room).emit("message", {
        data: {
          user: { name: "Admin" },
          message: `${user.name} has left room: ${user.room}`
        }
      });

      await User.findByIdAndDelete(userJoinedId);

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

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function notFoundError(_, _, next) {
  next(new NotFound("Route not found"));
}

function mainErrorHandler(err, _, res, _) {
  res
    .status(err.status || SERVER_ERROR)
    .json({ message: err.message || "Unknown error" });
}
