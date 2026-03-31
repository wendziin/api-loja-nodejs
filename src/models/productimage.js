'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    static associate(models) {
      // Uma imagem pertence a um Produto
      ProductImage.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
    }
  }
  ProductImage.init({
    product_id: DataTypes.INTEGER,
    enabled: DataTypes.BOOLEAN,
    path: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProductImage',
    tableName: 'ProductImages',
  });
  return ProductImage;
};