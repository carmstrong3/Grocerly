const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/api/lists/";
const sequelize = require("../../src/db/models/index").sequelize;
const List = require("../../src/db/models").List;
const User = require("../../src/db/models").User;

describe("routes : lists", () => {
  // create fake data before running further tests in suite
  beforeEach((done) => {
    this.list;
    sequelize.sync({force: true}).then((res) => {
      List.create({
        title: "Thanksgiving Dinner Shopping List",
        description: "List for Thanksgiving party"
      })
        .then((list) => {
          this.list = list;
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
    })
  })
  // Test suite for the http GET of ../api/lists.
  describe("GET /api/lists", () => {
    // It should get the page with status code of 200 and all the lists
    it("should return a status code 200 and all lists", (done) => {
      request(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("Thanksgiving Dinner Shopping List")
        done();
      });
    });
  });

  // Test suite for the http GET of ../api/lists/:id
  describe("GET /api/lists/:id", () => {
    it("should return the first list from the database", (done) => {
      request(`${base}1`, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("Thanksgiving Dinner Shopping List")
        done();
      });
    });
  });

  // Test suite for the http POST of ../api/lists/create
  describe("POST /api/lists/create", () => {
    const options = {
      url: `${base}create`,
      form: {
        title: "Cake",
        description: "Birthday cake for someone"
      }
    };

    it("should create a new list and redirect to the new list's page", (done) => {
      request.post(options, (err, res, body) => {
        List.findOne({where: {title: "Cake"}})
          .then((list) => {
            expect(res.statusCode).toBe(303);
            expect(err).toBeNull();
            expect(list.title).toBe("Cake");
            expect(list.description).toBe("Birthday cake for someone");
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
      });
    });
  });

  // test suite for destroying a list
  describe("POST /api/lists/:id/destroy", () => {
    it("should delete the list with the associated id", (done) => {
      //return all the lists
      List.findAll()
        .then((list) => {
          // init list length counter
          const listCountPreDelete = list.length;
          expect(listCountPreDelete).toBe(1);
          // destroy the list item created at the "beforeEach" level
          request.post(`${base}${this.list.id}/destroy`, (err, res, body) => {
            List.findAll()
              .then((list) => {
                console.log(list)
                // the "this.list" item should be gone
                expect(err).toBeNull();
                expect(list.length).toBe(listCountPreDelete - 1);
                done();
              })
          });
        });
    });
  });

  // test suite for updating a list
  describe("POST /api/lists/:id/update", () => {
    it("should update the list with new information", (done) => {
      const options = {
        url: `${base}${this.list.id}/update`,
        form: {
          title: "Side-dish",
          description: "Actually we're just gonna do a side dish"
        }
      };

      request.post(options, (err, res, body) => {
        expect(err).toBeNull();

        List.findOne({
          where: {id: this.list.id}
        })
          .then((list) => {
            expect(list.title).toBe("Side-dish");
            done();
          });
      });
    });
  });
});
