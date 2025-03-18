const express = require("express");
const pool = require("./db/pool");
const path = require("node:path");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const passport = require("./authentication/passportConfig");
require("dotenv").config();
const messagesRouter = require("./routes/messagesRouter");

// just for showing users to troubleshoot
async function getUsers() {
    const { rows } = await pool.query("select * from users");
    return rows;
}
getUsers().then((users) => console.log(users));
// delete when done

const app = express();
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
    next();
});

app.use("/", messagesRouter);

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
app.listen(PORT, () => console.log(`App listening on Port: ${PORT}`));
