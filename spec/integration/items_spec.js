const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/api/lists";

const sequelize = require("../../src/db/models/index").sequelize;
const List = require("../../src/db/models").List;
const Item = require("../../src/db/models").Item;
const User = require("../../src/db/models").User;

describe("routes : items", () => {
  beforeEach((done) => {
    this.list;
    this.item;
    this.user;

    sequelize.sync({force: true}).then((res) => {
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
        .then((user) => {
          this.user = user;

          List.create({
            title: "Brunch List",
            description: "Chilaquiles!",
            items: [{
              title: "maza",
              purchased: false,
              userId: this.user.id
            }]
          }, {
            include: {
              model: Item,
              as: "items"
            }
          })
          .then((list) => {
            this.list = list;
            this.item = this.list.items[0];
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
      });
    });
  });
  // suite for creating items
  describe("POST /api/lists/:listId/items/create", () => {
    it("should create a new item and redirect to the same list page", (done) => {
      const options = {
        url: `${base}/${this.list.id}/items/create`,
        form: {
          title: "Lemon",
          purchased: false,
          listId: this.list.id,
          userId: this.user.id
        }
      };
      request.post(options, (err, res, body) => {
        Item.findOne({where: {title: "Lemon"}})
          .then((item) => {
            expect(item).not.toBeNull();
            expect(item.title).toBe("Lemon");
            expect(item.purchased).toBe(false);
            expect(item.listId).not.toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
      });
    });

    it("should not create a new item that fails validations", (done) => {
      const options = {
        url: `${base}/${this.list.id}/items/create`,
        form: {
          title: "a",
          purchased: "b"
        }
      };

      request.post(options, (err, res, body) => {
        Item.findOne({where: {title: "a"}})
          .then((item) => {
            expect(item).toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
      });
    });
  })

  // suite for deleting items
  describe("POST /api/lists/:listId/items/destroy", () => {
    it("should destroy an item with the associated ID", (done) => {
      item = this.item;
      expect(item.id).toBe(1);

      request.post(`${base}/${this.list.id}/items/${this.item.id}/destroy`, (err, res, body) => {
        Item.findByPk(1)
          .then((item) => {
            expect(err).toBeNull();
            expect(item).toBeNull();
            done();
          })
      });
    })
  })

  // suite for updating items
  describe("POST /api/lists/:listId/items/:id/update", () => {
    it("should update the post with the given values", (done) => {
      request.post({
        url: `${base}/${this.list.id}/items/${this.item.id}/update`,
        form: {
          title: "Tortilla Chips",
          purchased: false,
          listId: this.list.id
        }
      }, (err, res, body) => {
        expect(res.statusCode).toBe(302);
        done();
        Item.findOne({
            where: {id: this.item.id}
          })
          .then((item) => {
            expect(item.title).toBe("Tortilla Chips");
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          })
        });
        done();
    });
  });

})
