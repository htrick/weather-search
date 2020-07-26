const router = require("express").Router();
let LocationList = require("../models/locationList.model");

router.route("/").get((req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/user/login");
    }
    LocationList.find({userEmail: req.user.email})
        .then(locationList => {
            res.render("locations", {locations: locationList.locations});
        }).catch(err => res.status(400).json("Error: " + err));
});

router.route("/:location").get((req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/user/login");
    }
    LocationList.findOne({userEmail: req.user.email})
        .then(locationList => {
            for (let i = 0; i < locationList.locations.length; i++) {
                if (locationList.locations[i].name === req.params.location) {
                    return res.render("location", {location: locationList.locations[i]});
                }
            }
            res.status(404).json("Error: Location not found");
        }).catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
