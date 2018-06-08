const Count = require("./models/count");

function seeDb(){
    Count.create({count: 0}).then((rCount)=>{
        console.log(rCount);
    });
}

module.exports = seeDb;