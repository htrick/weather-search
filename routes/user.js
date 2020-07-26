const router = require("express").Router();
let User = require("../models/user.model");
let LocationList = require("../models/locationList.model");
const passport = require("passport");
const bcrypt = require("bcryptjs");

router.route("/login").get((req, res) => {
    res.render("login");
});

router.route("/register").get((req, res) => {
    res.render("register");
});

router.route("/register").post((req, res) => {
    const {name, email, password, password2} = req.body;
    let errors = [];
    if (!name || !email || !password || !password2) {
        errors.push({msg: "Please enter all fields"});
    }
    if (password != password2) {
        errors.push({msg: "Passwords do not match"});
    }
    if (errors.length > 0) {
        return res.render("register", {errors, name, email, password, password2});
    }
    User.findOne({email: email}).then((user) => {
        if (user) {
            errors.push({msg: "Email already registered"});
            return res.render("register", {errors, name, email, password, password2});
        }
        const newUser = User({name, email, password});
        LocationList({userEmail: email}).save().then().catch(err => console.log(err));
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save().then((user) => {
                    req.flash("success", "Registration successful. You can now log in");
                    res.redirect("/user/login");
                }).catch(err => console.log(err));
            });
        });
    });
});

router.route("/login").post((req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/locations",
        failureRedirect: "/user/login",
        failureFlash: true
    })(req, res, next);
});

router.route("/logout").get((req, res) => {
    req.logout();
    req.flash("success", "You are now logged out");
    res.redirect("/");
});

module.exports = router;
