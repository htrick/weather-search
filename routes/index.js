const router = require("express").Router();
const axios = require("axios");
const Geocodio = require("geocodio-library-node");
const geocoder = new Geocodio(process.env.GEO_API_KEY);

router.route("/").get((req, res) => {
    res.render("index", {auth: req.isAuthenticated()});
});

router.route("/").post((req, res) => {
    geocoder.geocode(req.body.locationQuery)
        .then(response => {
            const location = response.results[0].location;
            axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lng}&exclude=minutely&appid=${process.env.WEATHER_API_KEY}`)
                .then(result => {
                    res.render("index", {weatherData: result.data, locationQuery: req.body.locationQuery, auth: req.isAuthenticated()});
                }).catch(err => res.render("index", {weatherData: "", locationQuery: req.body.locationQuery, err: err, auth: req.isAuthenticated()}));
        }).catch(err => res.render("index", {weatherData: "", locationQuery: req.body.locationQuery, err: err, auth: req.isAuthenticated()}));
});

module.exports = router;
