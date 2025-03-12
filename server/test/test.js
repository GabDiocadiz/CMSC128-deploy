import request from "supertest";
//import app from "../server.js"

let app;
before(async () => {
  app = (await import("../server.js")).default;
});

describe('GET /alumni/read', function() {
  before(function() {
    console.log('Starting tests...');
  });

  after(function() {
    console.log('Tests completed.');
  });

  it('should respond with json', function(done) {
    request(app)
      .get('/alumni/read')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        console.log("Test response: ", res.body);
        done();
      })
  })
})