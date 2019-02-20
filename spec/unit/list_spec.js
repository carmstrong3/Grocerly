const sequelize = require("../../src/db/models/index").sequelize;
const List = require("../../src/db/models").List;
const Item = require("../../src/db/models").Item;
const User = require("../../src/db/models").User;

describe("List", () => {

  // setup a list and item to test for each suite
  beforeEach((done) => {
    this.list;
    this.item;
    this.user;

    sequelize.sync({force: true}).then((res) => {
      // create a User object
      User.create({
        username: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
        .then((user) => {
          this.user = user;

        // create a List object
        List.create({
          name: "Babaghanoush",
          items: [{
            name: "Eggplant",
            purchased: false,
          }]
        }, {
          include: {
            model: Item,
            as: "items"
          }
        })
        .then((list) => {
          this.list = list;
          this.item = list.items[0];
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });
  describe("#setList()", () => {
    it("should associate a list and an item together", (done) => {
      List.create({
        name: "Memorial Day Lunch",
      })
        .then((newList) => {
          expect(this.item.listId).toBe(this.list.id);

          this.item.setList(newList)
            .then((item) => {
              expect(item.listId).toBe(newList.id);
              done();
            });
        });
    });
  });
  // getList function test suite
  describe("#getList()", () => {
    it("should return the associated List", (done) => {
      this.item.getList()
        .then((associatedList) => {
          expect(associatedList.name).toBe("Babaghanoush");
          done();
        })
    })
  })
})
