const mongoose = require("mongoose");

const filesSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    size: {
        type: Number,
    },
    path_on_disk: {
        type: String,
    },
    identifier: {
        type: String
    }
});

module.exports = mongoose.model("File", filesSchema);

// console.log(Math.random().toString(36).slice(2));