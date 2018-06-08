const mongoose = require("mongoose");

const countSchema = {
    count: {
        type: Number,
        default: 0
    }
};

module.exports = mongoose.model("Count", countSchema);
