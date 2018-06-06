const express = require("express");
const app = express();

app.get("/", (req, res)=>{
    res.send("welcome there");
});


app.listen(7000, ()=>{
    console.log("Started at " + 7000);
});

