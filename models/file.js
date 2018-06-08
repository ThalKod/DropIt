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
    },
    uploaded_date: {
        type: Date,
        default: Date.now()
    },
    downloaded: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("File", filesSchema);

