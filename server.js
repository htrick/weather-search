const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const expressEjsLayouts = require("express-ejs-layouts");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session);

// Database
require("dotenv").config();
mongoose.connect(process.env.ATLAS_URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.once("open", () => console.log("Connected to database"));

// Server
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// EJS
app.use(expressEjsLayouts);
app.set("view engine", "ejs");

// Session
app.use(session({
    secret: "nvm297465nbv35v2nm48mv248",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: db})
}));

// Passport
require("./passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    next();
});

// Static
app.use(express.static("./public"));

// Routes
app.use("/", require("./routes/index"));
app.use("/user", require("./routes/user"));
app.use("/locations", require("./routes/locations"));
app.use("/api", require("./routes/api"));

// Port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
