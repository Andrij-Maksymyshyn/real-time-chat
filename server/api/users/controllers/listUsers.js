const services = require("../services");

const listUsers = async (_, res, next) => {
  try {
    const result = await services.getAllUsers();

    res.json({
      status: "success",
      code: 200,
      data: {
        result
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = listUsers;
