const { Router } = require("express");
const messagesController = require("../controllers/messagesController");
const asyncHandler = require("../middleware/asyncHandler");
const messagesRouter = Router();

messagesRouter.get("/", messagesController.logInGet);

messagesRouter.get("/sign-up", messagesController.signUpGet);

messagesRouter.post("/sign-up", asyncHandler(messagesController.signUpPost));

messagesRouter.get("/log-out", messagesController.logOutGet);

messagesRouter.post("/log-in", asyncHandler(messagesController.logInPost));

module.exports = messagesRouter;
