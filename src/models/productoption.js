'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductOption extends Model {
    static associate(models) {
      // Uma opção pertence a um Produto
      ProductOption.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
    }
  }
  ProductOption.init({
    product_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    shape: DataTypes.ENUM('square', 'circle'),
    radius: DataTypes.INTEGER,
    type: DataTypes.ENUM('text', 'color'),
    values: DataTypes.STRING // Aqui vamos salvar os valores separados por vírgula
  }, {
    sequelize,
    modelName: 'ProductOption',
    tableName: 'ProductOptions',
  });
  return ProductOption;
};