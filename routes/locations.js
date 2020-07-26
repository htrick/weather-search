const router = require("express").Router();
const axios = require("axios");
let LocationList = require("../models/locationList.model");
const Geocodio = require("geocodio-library-node");
const geocoder = new Geocodio(process.env.GEO_API_KEY);

router.route("/").get((req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/user/login");
    }
    LocationList.findOne({userEmail: req.user.email})
        .then(locationList => {
            res.render("locations", {locations: locationList.locations});
        }).catch(err => res.status(400).json("Error: " + err));
});

router.route("/").post((req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(400).json("Error: not authenticated");
    }
    geocoder.geocode(req.body.locationQuery)
        .then(response => {
            const location = response.results[0].location;
            LocationList.findOne({userEmail: req.user.email})
                .then(locationList => {
                    locationList.locations.push({name: req.body.locationQuery, lat: location.lat, lng: location.lng});
                    locationList.save()
                        .then(result => {
                            res.render("locations", {locations: locationList.locations});
                        }).catch(err => res.status(400).jason("Error: " + err));
                }).catch(err => res.status(400).json("Error: " + err));
        }).catch(err => {
            LocationList.findOne({userEmail: req.user.email})
                .then(locationList => {
                    res.render("locations", {locations: locationList.locations, err: "Location not found"});
                }).catch(err => res.status(400).json("Error: " + err));
        });
});

router.route("/:location").get((req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(400).json("Error: not authenticated");
    }
    LocationList.findOne({userEmail: req.user.email})
        .then(locationList => {
            for (let i = 0; i < locationList.locations.length; i++) {
                if (locationList.locations[i].name === req.params.location) {
                    const location = locationList.locations[i];
                    axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lng}&exclude=minutely&appid=${process.env.WEATHER_API_KEY}`)
                        .then(response => {
                            res.render("location", {location: location, weatherData: response.data});
                        }).catch(err => res.render("location", {err: err}));
                }
            }
        }).catch(err => res.render("location", {err: err}));
});

router.route("/delete/:location").get((req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(400).json("Error: not authenticated");
    }
    LocationList.findOne({userEmail: req.user.email})
        .then(locationList => {
            for (let i = 0; i < locationList.locations.length; i++) {
                if (locationList.locations[i].name === req.params.location) {
                    const oldLocation = locationList.locations.splice(i, 1);
                    locationList.save().catch(err => console.log(err));
                    return res.redirect("/locations");
                }
            }
            res.status(404).json("Error: not found");
        }).catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
