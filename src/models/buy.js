'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Buy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
    }
  };
  Buy.init({
    userId:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
  });

  Buy.associate = function(models){
      Buy.belongsTo(models.users,{ as: "users", foreignKey: "userId" } );
      Buy.belongsToMany(models.Product, { as: "products", through: models.Buy_Product, foreignKey: "buyId" } );
  };

  return Buy;
};