'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // As associações com outras tabelas ficam aqui (se houver)
    }
  }
  
  User.init({
    firstname: DataTypes.STRING,
    surname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users', // Garante que ele procure a tabela correta
    timestamps: true,
    createdAt: 'created_at', // Mapeando o nome exato da coluna no banco
    updatedAt: 'updated_at'  // Mapeando o nome exato da coluna no banco
  });
  
  return User;
};
