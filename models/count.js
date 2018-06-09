const mongoose = require("mongoose");

const countSchema = new mongoose.Schema({
    count: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("Count", countSchema);
