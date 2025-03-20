const { Router } = require("express");
const usersController = require("../controllers/usersController");
const usersRouter = Router();

usersRouter.get("/", usersController.logInGet);

usersRouter.get("/sign-up", usersController.signUpGet);

usersRouter.post("/sign-up", usersController.signUpPost);

usersRouter.get("/log-out", usersController.logOutGet);

usersRouter.post("/log-in", usersController.logInPost);

usersRouter.get("/membership-form", usersController.membershipGet);

usersRouter.post("/membership-form", usersController.membershipPost);

module.exports = usersRouter;
