const Count = require("./models/count");

// Create a Count document
function seeDb(){
    Count.create({ count: 0 }).then((rCount)=>{
        console.log("Initial Count : ", rCount);
    });
}

module.exports = seeDb;