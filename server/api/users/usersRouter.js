const usersRouter = require("express").Router();

const controllers = require("./controllers");
const { checkIsUserExists } = require("./middlewares");

usersRouter.get("/", controllers.listUsers);

usersRouter.use("/:userId", checkIsUserExists);

usersRouter.get("/:userId", controllers.singleUser);

module.exports = usersRouter;
