const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:5000/api/users";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {

  beforeEach((done) => {

    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });

  });
  // suitre for using http POST method with users
  describe("POST /api/users/create", () => {

    it("should create a new user with valid values and redirect", (done) => {

      const options = {
        url: `${base}/create`,
        form: {
          username: "user@example.com",
          password: "123456789"
        }
      }

      request.post(options,
        (err, res, body) => {

          User.findOne({where: {username: "user@example.com"}})
          .then((user) => {
            expect(user).not.toBeNull();
            expect(user.username).toBe("user@example.com");
            expect(user.id).toBe(1);
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        }
      );
    });

    it("should not create a new user with invalid attributes and redirect", (done) => {
      request.post(
        {
          url: `${base}/create`,
          form: {
            username: "no",
            password: "123456789"
          }
        },
        (err, res, body) => {
          User.findOne({where: {username: "no"}})
          .then((user) => {
            expect(user).toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        }
      );
    });

  });

});
