const request = require("supertest");
const app = require("../app");
// const File = require("./models/file");
const Count = require("../models/count");

let count;

beforeAll(() => {
    Count.create({ count: 0 }).then((rCount)=>{
        count = rCount.count;
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