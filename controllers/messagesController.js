const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("../middleware/asyncHandler");

const messageValidator = [
    body("title")
        .trim()
        .isLength({ min: 1, max: 255 })
        .withMessage("Title must be between 1 and 255 characters."),
    body("text")
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage("Message text must be between 1 and 1000 characters."),
];

function newMessageGet(req, res) {
    res.render("new-message-form");
}

const newMessagePost = [
    messageValidator,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render("new-message-form", {
                title: req.body.title,
                text: req.body.text,
                errors: errors.array(),
            });
        }

        await db.messages.insertMessage(
            req.user.id,
            req.body.title,
            req.body.text
        );
        res.redirect("/");
    }),
];

async function deleteMessagePost(req, res) {
    const id = req.params.id;
    await db.messages.deleteMessage(id);
    res.redirect("/");
}

module.exports = {
    newMessageGet,
    newMessagePost,
    deleteMessagePost,
};
