const services = require("../services");

const listUsers = async (_, res, next) => {
  try {
    const result = await services.getAllUsers();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = listUsers;
