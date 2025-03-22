const express = require("express");
const pool = require("./db/pool");
const path = require("node:path");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const passport = require("./authentication/passportConfig");
require("dotenv").config();
const homeRouter = require("./routes/homeRouter");
const usersRouter = require("./routes/usersRouter");
const messagesRouter = require("./routes/messagesRouter");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
    session({
        store: new pgSession({
            pool: pool,
            tableName: "session",
        }),
        saveUninitialized: false,
        secret: process.env.SECRET,
        resave: false,
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days: 30 days * 24 hrs * 60 min * 60 sec * 1000 ms
    })
);

app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.errorMessages = req.session.messages || [];
    req.session.messages = [];
    next();
});

app.use("/", homeRouter);
app.use("/user", usersRouter);
app.use("/messages", messagesRouter);

app.use("*", (req, res) => {
    res.render("errorPage", {
        title: "Page doesn't exist",
        message:
            "Uh-oh! Looks like this page doesn't exist. Click below to return Home.",
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.status || 500);

    res.render("errorPage", {
        title: "Error",
        message: "Something went wrong! Please try again later.",
        error: process.env.NODE_ENV === "production" ? {} : err,
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "::", () => console.log(`App listening on Port: ${PORT}`));
