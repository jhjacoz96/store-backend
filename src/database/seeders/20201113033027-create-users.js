'use strict';

const bcrypt = require("../../helpers/bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let users = [{
      username: 'jhon',
      email: 'jhjacoz96@gmail.com',
      password: await bcrypt.generateHash("12345678"),
      rolId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      username: 'jhon1',
      email: 'jhjacoz965@gmail.com',
      password: await bcrypt.generateHash("12345678"),
      rolId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      username: 'jhon2',
      email: 'jhjacoz963@gmail.com',
      password: await bcrypt.generateHash("12345678"),
      rolId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]
     await queryInterface.bulkInsert('users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
