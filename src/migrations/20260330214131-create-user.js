'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false // Preenchimento obrigatório
      },
      surname: {
        type: Sequelize.STRING,
        allowNull: false // Preenchimento obrigatório
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false, // Preenchimento obrigatório
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false // Preenchimento obrigatório
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
