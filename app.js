const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require('multer');
const File = require("./models/file");
const Count = require("./models/count");
const config = require("./config");
const crypto = require('crypto');
const mime = require("mime-types");
const util = require('util');
const seed = require("./seedb");
const upload = multer({
    storage: multer.diskStorage({
        destination: 'files/',
        filename: function (req, file, cb) {
            crypto.pseudoRandomBytes(4, function (err, raw) {
                const mime_type = mime.lookup(file.originalname);
                const nameSplit = file.originalname.split(".");
                nameSplit.pop();
                const name = nameSplit.join(".");
                cb(null, raw.toString('hex') + name + '.' + mime.extension(mime_type));
            });
        }
    })
});

// configure app and mongoose
mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 7000);

// middlewares
app.use(express.static(__dirname + "/public"));

// seed();

// routes
app.get("/", (req, res) => {
    File.find({}).then((rFiles) => {
        Count.find({}).then((rCount) => {
            res.render("index", { uploadTime: rFiles.length, dTime: rCount[0].count });
        });
    }).catch(() => {
        res.redirect("/");
    });
});

// Ajax upload count
app.get("/count", (req, res) => {
    const result = { error: "", data: "" };

    File.find({}).then((rFiles) => {
        result.data = rFiles.length;
        res.send(result);
    }).catch((err) => {
        result.error = err;
        res.send(result);
    });
});

app.get("/:id", (req, res) => {
    File.findOne({ identifier: req.params.id }).then((rFile) => {
        rFile.downloaded++;
        rFile.save();

        Count.find({}).then((rCount) => {
            rCount[0].count++;
            rCount[0].save();
        });

        const file = rFile.path_on_disk;
        res.download(file);
    }).catch(() => {
        res.redirect("/");
    });
});

app.post("/upload", upload.single("file"), (req, res) => {
    if (req.file) {
        const identifier = Math.random().toString(36).slice(2);
        const data = {
            url: identifier,
            name: req.file.originalname,
            encoding: req.file.encoding,
            mimetype: req.file.mimetype,
            size: req.file.size
        };

        const file = {
            name: data.name,
            size: data.size,
            path_on_disk: req.file.path,
            identifier: identifier,
        };

        File.create(file).then((rFile) => {
            return res.status(200).send(data);
        });
    }
});

// boot if db is available
mongoose.connect(config.dbURL, { server: { reconnectTries: 5 } })
    .then(db => {
        // boot
        app.listen(app.get("port"), () => {
            console.log("Listening on port: ", app.get("port"));
        });
    })
    .catch(dbErr => {
        console.log("DB Connection Error: ", dbErr.message);
        process.exit(1);
    });