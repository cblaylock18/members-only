const { Router } = require("express");
const homeController = require("../controllers/homeController");
const asyncHandler = require("../middleware/asyncHandler");
const homeRouter = Router();

homeRouter.get("/", asyncHandler(homeController.homeGet));

module.exports = homeRouter;
