'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wish extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     

    }
  };
  Wish.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
  });

  Wish.associate = function(models){
    Wish.belongsTo(models.users, {as: "users", foreignKey: "userId" });
    Wish.belongsTo(models.Product, {as: "Products", foreignKey: "productId" });
  };

  return Wish;
};