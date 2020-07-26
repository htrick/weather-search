const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    registrationDate: {type: Date, default: Date.now},
});

module.exports = mongoose.model("User", userSchema);
