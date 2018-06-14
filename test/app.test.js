const request = require("supertest");
const app = require("../app");
const File = require("./models/file");
const Count = require("../models/count");

let count;
let file;

beforeAll(() => {
    Count.create({ count: 0 }).then((rCount)=>{
        count = rCount.count;
    });

    File.create({
        name: "testname",
        size: 13234,
        path_on_disk: "/test/path",
        identifier: "2525Eda",
    }).then((rFile)=>{
        file = rFile;
    })
});

describe("GET / ", ()=>{
    it("Should return status code 200", (done)=>{
        request(app)
            .get("/")
            .expect(200)
            .end(done);
    });
});

describe("GET /count ", ()=>{
    it("Should return the number of uploaded file", (done)=>{
        request(app)
            .get("/")
            .expect(200)
            .end((err, res)=>{
                if(err){
                    return finish(err);
                 }
                 console.log(res);
                 done();
            });
    });
});