'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let categories = [{
      name: 'Juegos',
      slug: 'juegos',
      createdAt: new Date(),
      updatedAt: new Date(),
    },{
      name: 'Redes Sociales',
      slug: 'redes_sociales',
      createdAt: new Date(),
      updatedAt: new Date(),
    }]
    await queryInterface.bulkInsert('Categories', categories, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
