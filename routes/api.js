const router = require("express").Router();
const axios = require("axios");
let LocationList = require("../models/locationList.model");
const Geocodio = require("geocodio-library-node");
const geocoder = new Geocodio(process.env.GEO_API_KEY);

router.route("/single/:location").get((req, res) => {
    geocoder.geocode(req.params.location)
        .then(response => {
            const location = response.results[0].location;
            axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lng}&exclude=minutely&appid=${process.env.WEATHER_API_KEY}`)
                .then(result => {
                    res.json(result.data);
                }).catch(err => res.json("Error: " + err));
        }).catch(err => res.json("Error: " + err));
});

router.route("/:location").get((req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(400).json("Error: not authenticated");
    }
    LocationList.findOne({userEmail: req.user.email})
        .then(locationList => {
            let found = false;
            for (let i = 0; i < locationList.locations.length; i++) {
                if (locationList.locations[i].name === req.params.location) {
                    const location = locationList.locations[i];
                    found = true;
                    axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lng}&exclude=minutely&appid=${process.env.WEATHER_API_KEY}`)
                        .then(response => {
                            res.json(response.data);
                        }).catch(err => console.log(err));
                }
            }
            if (!found) {
                res.status(404).json("Error: Location not found");
            }
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
                            res.json(result);
                        }).catch(err => res.status(400).jason("Error: " + err));
                }).catch(err => res.status(400).json("Error: " + err));
        }).catch(err => res.status(400).json("Error: " + err));
    
});

router.route("/:location").delete((req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(400).json("Error: not authenticated");
    }
    LocationList.findOne({userEmail: req.user.email})
        .then(locationList => {
            for (let i = 0; i < locationList.locations.length; i++) {
                if (locationList.locations[i].name === req.params.location) {
                    const oldLocation = locationList.locations.splice(i, 1);
                    locationList.save().catch(err => console.log(err));
                    return res.json(oldLocation);
                }
            }
            res.status(404).json("Error: not found");
        }).catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
