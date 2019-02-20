const User = require("./models").User;

module.exports = {
  createUser(newUser, callback){

    return User.create({
      username: newUser.username,
      password: newUser.password
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },

  deleteUser(id, callback){
    return User.destroy({
      where: {id}
    })
      .then((deletedRecordsCount) => {
        callback(null, deletedRecordsCount);
      })
      .catch((err) => {
        callback(err);
      })
  }
}

