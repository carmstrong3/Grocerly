'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "must be a valid email"}
      },
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.belongsToMany(models.List, {
      as: "MyLists",
      through: "Groups",
      foreignkey: "listId"
    })
  };

  User.prototype.validPassword = function(password) {
    return password === this.password;
  }

  return User;
};
