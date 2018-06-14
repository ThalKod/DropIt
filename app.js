const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require('multer');
const File = require("./models/file");
const Count = require("./models/count");
const config = require("./config");
const crypto = require('crypto');
const mime = require("mime-types");
const path = require('path');
const initialCount = require("./seedb");
const upload = multer({
    storage: multer.diskStorage({
        destination: path.join(__dirname, 'files/'),
        filename: function (req, file, cb) {
            crypto.pseudoRandomBytes(4, function (err, raw) {
                const mime_type = mime.lookup(file.originalname);

                // throw away any extension if provided
                const nameSplit = file.originalname.split(".").slice(0,-1);
                //nameSplit.pop();

                // replace all white spaces with - for safe file name on different filesystem 
                const name = nameSplit.join(".").replace(/\s/g,'-');
                cb(null, raw.toString('hex') + name + '.' + mime.extension(mime_type));
            });
        }
    })
});

// configure app and mongoose
mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
// app.set("port", process.env.PORT || 7000);

// middlewares
app.use(express.static(__dirname + "/public"));


// routes
app.get("/", (req, res) => {
    File.find({}).then((rFiles) => {

        let templateData = {  uploadTime: 0, dTime: 0 };

        if (rFiles != null && rFiles.length) {
            templateData.uploadTime = rFiles.length;
        }

        Count.find({}).then((rCount) => {

            if (rCount != null && rCount.length) {
                templateData.dTime = rCount[0].count;
            }else{
                // Initialize db count
                initialCount();
            }

            res.render("index", templateData);
        });
    }).catch(() => {
        res.redirect("/");
    });
});

// Ajax upload count
app.get("/count", (req, res) => {
    const result = { error: "", data: "" };

    File.find({}).then((rFiles) => {

        result.data = rFiles != null && rFiles.length ? rFiles.length : 0;
        res.send(result);

    }).catch((err) => {
        result.error = err;
        res.send(result);
    });
});

app.get("/:id", (req, res) => {
    File.findOne({ identifier: req.params.id }).then((rFile) => {

        if (rFile == null ) {
            return res.sendStatus(404);
        }
        
        rFile.downloaded++;
        rFile.save();

        Count.find({}).then((rCount) => {

            if (rCount != null && rCount.length) {
                rCount[0].count++;
                rCount[0].save();
            }
            
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
    }else{
        res.status(404).send();
    }
});

// boot if db is available
mongoose.connect(config.dbURL, { reconnectTries: 5 })
    .then(db => {
        // boot
        app.listen(config.port, () => {
            console.log("Listening on port: ", config.port);
        });
    })
    .catch(dbErr => {
        console.log("DB Connection Error: ", dbErr.message);
        process.exit(1);
    });

process.once('unhandledRejection',err => {
    console.log('UNHANDLED_REJECTION: ', err.stack.toString());
    process.exit(1);
});

process.once('uncaughtException',err => {
    console.log('UNHANDLED_EXCEPTION: ', err.stack.toString());
    process.exit(1);
});

module.exports = app;