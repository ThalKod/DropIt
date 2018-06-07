const express = require("express");
const app = express();
const multer  = require('multer')
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

        const data = {
            url: req.file.path,
            name: req.file.originalname,
            encoding: req.file.encoding,
            mimetype: req.file.mimetype,
            size: req.file.size
        }
        return res.status(200).send(data);
    }
});

app.listen(7000, ()=>{
    console.log("Started at " + 7000);
});

