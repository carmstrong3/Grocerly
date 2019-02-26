'use strict';
module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define('List', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  List.associate = function(models) {
    // associations can be defined here
    List.hasMany(models.Item, {
      foreignKey: "listId",
      as: "items"
    });
    List.belongsToMany(models.User, {
      through: "Groups",
      as: "users",
      foreignKey: "listId",
    });
  };
  return List;
};
