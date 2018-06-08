const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer  = require('multer');
const File = require("./models/file");
const Count = require("./models/count");
const seed = require("./seedb");
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

// seed();

app.get("/", (req, res)=>{
    File.find({}).then((rFiles)=>{
        Count.find({}).then((rCount)=>{
            res.render("index", {uploadTime: rFiles.length, dTime: rCount[0].count});
        });
    }).catch(()=>{
        res.redirect("/");
    });
});

// Ajax upload count
app.get("/count", (req, res)=>{
    const result = {error:"", data: ""};

    File.find({}).then((rFiles)=>{
        result.data = rFiles.length;
        res.send(result);
    }).catch((err)=>{
        result.error = err;
        res.send(result);
    });
});

app.get("/:id", (req, res)=>{
    File.findOne({identifier: req.params.id}).then((rFile)=>{
        rFile.downloaded++;
        rFile.save();

        Count.find({}).then((rCount)=>{
            rCount[0].count++;
            rCount[0].save();
        });
        
        const file = "files/" + rFile.name;
        res.download(file);
    }).catch(()=>{
        res.redirect("/");
    });
});

app.post("/upload", upload.single("file"), (req, res)=>{
    if(req.file){
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
            path_on_disk: "files/" + data.name,
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

