const db = require("../db/queries");

async function homeGet(req, res) {
    const messages = await db.messages.getMessages();

    res.render("index", { messages: messages });
}

module.exports = {
    homeGet,
};
