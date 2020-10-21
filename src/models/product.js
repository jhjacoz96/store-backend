'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
  });

  Product.associate = function(models){
    Product.belongsTo(models.users, { as: "users", foreignKey: "userId" });
    Product.belongsTo(models.Category, { as: "categories", foreignKey: "categoryId" });
    Product.belongsToMany(models.Buy, { as: "buys", through: "Buy_Product", foreignKey: "productId" } );
    Product.hasMany(models.Wish, {as: "Wishes", foreignKey: "productId" });
  };

  return Product;
};