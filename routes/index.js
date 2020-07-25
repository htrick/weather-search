const router = require("express").Router();

router.route("/").get((req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/locations");
    }
    res.render("index");
});

module.exports = router;
