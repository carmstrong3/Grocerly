const sequelize = require("../../src/db/models/index").sequelize;
const List = require("../../src/db/models").List;
const Item = require("../../src/db/models").Item;
const User = require("../../src/db/models").User;

describe("Item", () => {

  // setup a list, item, and user to test for each suite
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

  describe("#create()", () => {
    it("should create an item object with a title, purchased status, and associated list id", (done) => {
      // create the item object
      Item.create({
        name: "Cinnamon",
        purchased: false,
        listId: this.list.id,
        })
        .then((item) => {
          expect(item.name).toBe("Cinnamon");
          expect(item.purchased).toBe(false);
          expect(item.listId).toBe(this.list.id)
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
    });
    // test that should fail because of improper input
    it("should not create an item with missing information", (done) => {
      Item.create({
        name: "stuff"
      })
        .then((item) => {
          done();
        })
        .catch((err) => {
          // expect certain errors
          expect(err.message).toContain("Item.purchased cannot be null");
          expect(err.message).toContain("Item.listId cannot be null");
          done();
        });
    })
  });
  // setList function test suite
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
});
