const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer  = require('multer');
const File = require("./models/file");
const upload = multer({
    storage: multer.diskStorage({
        destination: 'files/',
        filename: function(req, file, cb) {
            // this overwrites the default multer renaming callback
            // and simply saves the file as it is
            cb(null, file.originalname)
        }
    })
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// MongoDb config
mongoose.connect("mongodb://localhost/dropit", (err)=>{
    if(err){
        throw err;
    }
});
mongoose.Promise = global.Promise;


app.get("/", (req, res)=>{
    res.render("index");
});

// app.get("/download", (req, res)=>{
//     const filePath = "upload/8f88293580bbd3b154868be33c0fab4c";
//     res.download(filePath);
// })


app.post("/upload", upload.single("file"), (req, res)=>{
    if(req.file){

        console.log(req.file);

        const identifier = Math.random().toString(36).slice(2);

        const data = {
            url: "/" + identifier,
            name: req.file.originalname,
            encoding: req.file.encoding,
            mimetype: req.file.mimetype,
            size: req.file.size
        };

        const file = {
            name: data.url,
            size: data.size,
            path_on_disk: "files/" + data.url,
            identifier: identifier,
        };

        File.create(file).then((rFile)=>{
            return res.status(200).send(data);
        });
    }
});

app.listen(7000, ()=>{
    console.log("Started at " + 7000);
});

