const request = require("supertest");
const app = require("../app");
const File = require("../models/file");

let fileCount = 0;

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

describe("POST /upload ", ()=>{
    it("Should upload and save the file in db", (done)=>{
        request(app)
            .post("/upload")
            .attach("file",__dirname + "/files/test.txt")
            .expect(200)
            .end((err, res)=>{
                if(err){
                    return finish(err);
                }

                File.find({}).then((rFiles)=>{
                    expect(rFiles.length).toBe(fileCount + 1);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            });
    });

    it("Should return 404 if no file uploaded", (done)=>{
        request(app)
            .post("/upload")
            .expect(404)
            .end(done);
    });
    
});
