const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    registration_date: {type: Date, default: Date.now},
    locations: [{
        name: {type: String, required: true},
        lat: {type: Number, required: true},
        lng: {type: Number, required: true}
    }]
});

module.exports = mongoose.model("User", userSchema);
