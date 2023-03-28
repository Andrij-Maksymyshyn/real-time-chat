const { User } = require("../../../models");

const getAllUsers = async () => {
  const data = await User.find({});

  if (!data) {
    return null;
  }

  return data;
};

module.exports = getAllUsers;
