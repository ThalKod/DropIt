const request = require("supertest");
const app = require("../app");
const File = require("../models/file");
const Count = require("../models/count");

let count = 0;
let fileCount;

beforeAll(() => {
    File.find({}).then((rFiles) => {
        if(rFiles != null && rFiles.length){
            return fileCount = rFiles.length;
        }
    }).catch((err) => {
        console.log(err);
    });
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
            .get("/count")
            .expect(200)
            .expect((res)=>{
                 expect(res.body.data).toBe(fileCount);
            })
            .end(done);
    });
});