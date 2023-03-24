const services = require("../services");
const { NotFound } = require("../../../errors/ApiError");

const checkIsUserExists = async (req, _, next) => {
  try {
    const { userId } = req.params;
    const user = await services.getUserById(userId);

    if (!user) {
      throw new NotFound(`user with id = ${userId} not found`);
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkIsUserExists;
