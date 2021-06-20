'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Buy_Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
    }
  };
  Buy_Product.init({
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    buyId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Buy_Product',
  });

  return Buy_Product;
};