const chai  = require("chai");

const chaiHttp = require("chai-http");
const {app, runServer, closeServer} = require("../server.js");

//const expect = chai.expect;

chai.use(chaiHttp);



describe("Blog Posts", function(){
    before(function(){
        return runServer();
    });

    after(function(){
        return closeServer();
    });

    it("should return all the blog posts on GET", function() {
        // for Mocha tests, when we're dealing with asynchronous operations,
        // we must either return a Promise object or else call a `done` callback
        // at the end of the test. The `chai.request(server).get...` call is asynchronous
        // and returns a Promise, so we just return it.
        return chai
          .request(app)
          .get('/blogPostsRouter')
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a("array");
    
            // because we create three blog posts on app load
            expect(res.body.length).to.be.at.least(1);
            // each item should be an object with key/value pairs
            // for `id`, `name` and `checked`.
            const expectedKeys = ["id", "title", "content", "author", "publishDate"];
            res.body.forEach(function(item) {
              expect(item).to.be.a("object");
              expect(item).to.include.keys(expectedKeys);
            });
          });
    });

    it("should add a blog post on POST", function() {
        const newBlog = { title: "next new blog post", content: "This is my next blog", author: "SS" };
        return chai
          .request(app)
          .post('/blogPostsRouter')
          .send(newBlog)
          .then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a("object");
            expect(res.body).to.include.keys("title", "content", "author", "id", "publishDate");
            expect(res.body.id).to.not.equal(null);
            // response should be deep equal to `newBlog` from above if we assign
            // `id` to it from `res.body.id`
            //expect(res.body).to.deep.equal(
            //  Object.assign(newItem, { id: res.body.id })
            //);
          });
    });

      // test strategy:
  //  1. initialize some update data (we won't have an `id` yet)
  //  2. make a GET request so we can get an item to update
  //  3. add the `id` to `updateData`
  //  4. Make a PUT request with `updateData`
  //  5. Inspect the response object to ensure it
  //  has right status code and that we get back an updated
  //  item with the right data in it.
  it("should update items on PUT", function() {
    // we initialize our updateData here and then after the initial
    // request to the app, we update it with an `id` property so
    // we can make a second, PUT call to the app.
    const updateData = {
      title: "Updated blog post.",
      content: "This is my updated blog post.",
      author: "SS",
      publishDate: Date.now()
    };

    return (
      chai
        .request(app)
        // first have to get so we have an idea of object to update
        .get("/blogPostsRouter")
        .then(function(res) {
          updateData.id = res.body[0].id;
          // this will return a promise whose value will be the response
          // object, which we can inspect in the next `then` block. Note
          // that we could have used a nested callback here instead of
          // returning a promise and chaining with `then`, but we find
          // this approach cleaner and easier to read and reason about.
          return chai
            .request(app)
            .put(`/blogPostsRouter/${updateData.id}`)
            .send(updateData);
        })
        // prove that the PUT request has right status code
        // and returns updated item
        .then(function(res) {
          expect(res).to.have.status(204);          
        })
    );
  });

  it("should delete items on DELETE", function() {
    return (
      chai
        .request(app)
        // first have to get so we have an `id` of item
        // to delete
        .get("/blogPostsRouter")
        .then(function(res) {
          return chai.request(app).delete(`/blogPostsRouter/${res.body[0].id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
        })
    );
  });

});

const expect = require("chai").expect;
