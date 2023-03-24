const { User } = require("../../../models");

const getUserById = async userId => {
  const result = await User.findById(userId);

  if (!result) {
    return null;
  }

  return result;
};

module.exports = getUserById;
