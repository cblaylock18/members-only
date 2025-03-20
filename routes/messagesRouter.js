const { Router } = require("express");
const messagesController = require("../controllers/messagesController");
const asyncHandler = require("../middleware/asyncHandler");
const messagesRouter = Router();

messagesRouter.get("/new-message", messagesController.newMessageGet);

messagesRouter.post("/new-message", messagesController.newMessagePost);

messagesRouter.post(
    "/delete-message/:id",
    asyncHandler(messagesController.deleteMessagePost)
);

module.exports = messagesRouter;
