'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Um produto tem muitas Imagens
      Product.hasMany(models.ProductImage, { foreignKey: 'product_id', as: 'images' });
      // Um produto tem muitas Opções
      Product.hasMany(models.ProductOption, { foreignKey: 'product_id', as: 'options' });
      // Um produto pertence a várias Categorias (através da tabela ProductCategory)
      Product.belongsToMany(models.Category, { 
        through: models.ProductCategory, 
        foreignKey: 'product_id', 
        as: 'categories' 
      });
    }
  }
  Product.init({
    enabled: DataTypes.BOOLEAN,
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    use_in_menu: DataTypes.BOOLEAN,
    stock: DataTypes.INTEGER,
    description: DataTypes.STRING,
    price: DataTypes.FLOAT,
    price_with_discount: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Product;
};