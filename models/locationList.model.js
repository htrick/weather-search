const mongoose = require("mongoose");

const locationListSchema = mongoose.Schema({
    userEmail: String,
    locations: [{
        name: String,
        lat: Number,
        lng: Number
    }]
});

module.exports = mongoose.model("LocationList", locationListSchema);
