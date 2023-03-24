const mainRouter = require("express").Router();
const usersRouter = require("../api/users/usersRouter");

mainRouter.use("/api/users", usersRouter);

module.exports = mainRouter;
