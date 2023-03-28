const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, trim: true, required: true, default: "" },

    chatroom: { type: String, trim: true, required: true, default: "" },

    messageField: []

    // email: {
    //   type: String,
    //   trim: true,
    //   lowercase: true,
    //   required: true,
    //   unique: true,
    //   default: ""
    // },

    // password: {
    //   type: String,
    //   minLength: 7,
    //   required: true,
    //   default: ""
    // }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const User = mongoose.model("User", userSchema);

module.exports = {
  User
};
