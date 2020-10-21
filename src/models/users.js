'use strict';

const bcrypt = require('bcrypt');
const authConfig = require('../../config/auth');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     
    }
  };
  users.init({
    username: { 
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: { 
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    rolId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'users',
    freezeTableName: true,
    instanceMethods: { 
      generateHash(password) { 
        return bcrypt.hash(password, bcrypt.genSaltSync(Number.parseInt(authConfig.rounds))); 
      }, 
      validPassword(password) { 
        return bcrypt.compare(password, this.password); 
      }
    }
  });

  users.associate = function(models){
    users.belongsTo(models.rols, { as: "rols", foreignKey: "rolId" });
    users.hasMany(models.Product, { as: "products", foreignKey: "userId" });
    users.hasMany(models.Buy, { as: "buys", foreignKey: "userId" });
    users.hasMany(models.Wish, {as: "wish", foreignKey: "userId" });
  };

  return users;
};