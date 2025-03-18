const db = require("../db/pool");
const passport = require("../authentication/passportConfig");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

function logInGet(req, res) {
    res.render("index");
}

function signUpGet(req, res) {
    res.render("sign-up-form");
}

async function signUpPost(req, res) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await db.query(
        "insert into users (firstname, lastname, username, password) values ($1, $2, $3, $4)",
        [
            req.body.firstname,
            req.body.lastname,
            req.body.username,
            hashedPassword,
        ]
    );
    res.redirect("/");
}

function logOutGet(req, res, next) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}

const logInPost = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
});

module.exports = {
    logInGet,
    signUpGet,
    signUpPost,
    logOutGet,
    logInPost,
};
