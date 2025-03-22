const db = require("../db/queries");
const passport = require("../authentication/passportConfig");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("../middleware/asyncHandler");

const signUpValidator = [
    body("firstname")
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage("First Name must be between 1 and 30 characters.")
        .isAlpha()
        .withMessage("First name must only contain letters."),
    body("lastname")
        .trim()
        .isLength({ min: 1, max: 40 })
        .withMessage("Last Name must be between 1 and 30 characters.")
        .isAlpha()
        .withMessage("Last name must only contain letters."),
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username/email is required.")
        .isEmail()
        .withMessage("Your username must be a valid email address.")
        .normalizeEmail()
        .custom(async (value) => {
            const isFree = await db.users.isUsernameFreeQuery(value);
            if (!isFree) {
                throw new Error("Email already in use.");
            }
        }),
    body("password")
        .isLength({ min: 5, max: 255 })
        .withMessage("Password must be between 5 and 255 characters."),
    body("confirmpassword")
        .custom((value, { req }) => {
            return value === req.body.password;
        })
        .withMessage("Password fields must match."),
];

const logInValidator = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username/email is required.")
        .isEmail()
        .withMessage("Your username must be a valid email address.")
        .normalizeEmail(),
    body("password").isLength({ min: 1 }).withMessage("Password is required."),
];

const membershipValidator = [
    body("memberPassword")
        .notEmpty()
        .withMessage(
            "To become a member the password field must be filled out."
        )
        .custom(async (value) => {
            const match = await bcrypt.compare(
                value,
                process.env.MEMBERSHIP_PASSWORD
            );
            if (!match) {
                throw new Error(
                    "That's not the right password for membership!"
                );
            }
        }),
];

const adminValidator = [
    body("adminPassword")
        .notEmpty()
        .withMessage(
            "To become an admin the password field must be filled out."
        )
        .custom(async (value) => {
            const match = await bcrypt.compare(
                value,
                process.env.ADMIN_PASSWORD
            );
            if (!match) {
                throw new Error(
                    "That's not the right password to become an admin!"
                );
            }
        }),
];

function signUpGet(req, res) {
    res.render("sign-up-form");
}

const signUpPost = [
    signUpValidator,
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render("sign-up-form", {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: req.body.username,
                errors: errors.array(),
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        await db.users.insertUser(
            req.body.firstname,
            req.body.lastname,
            req.body.username,
            hashedPassword
        );

        next();
    }),

    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/",
        failureMessage: true,
    }),
];

function logOutGet(req, res, next) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}

const logInPost = [
    logInValidator,
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render("index", {
                errors: errors.array(),
            });
        }
        next();
    },
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/",
        failureMessage: true,
    }),
];

function membershipGet(req, res) {
    res.render("membership-form");
}

const membershipPost = [
    membershipValidator,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render("membership-form", {
                errors: errors.array(),
            });
        } else {
            await db.users.giveUserMembership(req.user.id);
            res.redirect("/");
        }
    }),
];

function adminGet(req, res) {
    res.render("admin-form");
}

const adminPost = [
    adminValidator,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render("admin-form", {
                errors: errors.array(),
            });
        } else {
            await db.users.giveUserAdmin(req.user.id);
            res.redirect("/");
        }
    }),
];

module.exports = {
    signUpGet,
    signUpPost,
    logOutGet,
    logInPost,
    membershipGet,
    membershipPost,
    adminGet,
    adminPost,
};
