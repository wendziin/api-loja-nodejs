'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Criar Categorias
    await queryInterface.bulkInsert('Categories', [
      { name: 'Tênis', slug: 'tenis', use_in_menu: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Acessórios', slug: 'acessorios', use_in_menu: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Casual', slug: 'casual', use_in_menu: true, created_at: new Date(), updated_at: new Date() }
    ]);

    // 2. Criar Produtos
    await queryInterface.bulkInsert('Products', [
      {
        enabled: true,
        name: 'Nike Revolution 6',
        slug: 'nike-revolution-6',
        use_in_menu: true,
        stock: 50,
        description: 'Tênis de corrida leve e confortável para o dia a dia.',
        price: 399.90,
        price_with_discount: 299.90,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        enabled: true,
        name: 'Adidas Coreracer',
        slug: 'adidas-coreracer',
        use_in_menu: true,
        stock: 30,
        description: 'Design moderno com amortecimento responsivo.',
        price: 299.90,
        price_with_discount: 199.90,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        enabled: true,
        name: 'Boné Nike Heritage',
        slug: 'bone-nike-heritage',
        use_in_menu: true,
        stock: 100,
        description: 'Boné clássico com ajuste confortável.',
        price: 129.90,
        price_with_discount: 99.90,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        enabled: true,
        name: 'Vans Old Skool',
        slug: 'vans-old-skool',
        use_in_menu: true,
        stock: 20,
        description: 'O clássico de skate com estilo icônico.',
        price: 399.90,
        price_with_discount: 399.90,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // 3. Associar Categorias (Usando IDs 1, 2, 3 assumindo banco limpo)
    await queryInterface.bulkInsert('ProductCategories', [
      { product_id: 1, category_id: 1, createdAt: new Date(), updatedAt: new Date() },
      { product_id: 2, category_id: 1, createdAt: new Date(), updatedAt: new Date() },
      { product_id: 3, category_id: 2, createdAt: new Date(), updatedAt: new Date() },
      { product_id: 4, category_id: 1, createdAt: new Date(), updatedAt: new Date() }
    ]);

    // 4. Adicionar Imagens
    await queryInterface.bulkInsert('ProductImages', [
      { product_id: 1, enabled: true, path: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600', createdAt: new Date(), updatedAt: new Date() },
      { product_id: 2, enabled: true, path: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600', createdAt: new Date(), updatedAt: new Date() },
      { product_id: 3, enabled: true, path: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600', createdAt: new Date(), updatedAt: new Date() },
      { product_id: 4, enabled: true, path: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600', createdAt: new Date(), updatedAt: new Date() }
    ]);

    // 5. Adicionar Opções
    await queryInterface.bulkInsert('ProductOptions', [
      { product_id: 1, title: 'Tamanho', shape: 'square', radius: 4, type: 'text', values: '39,40,41,42', createdAt: new Date(), updatedAt: new Date() },
      { product_id: 1, title: 'Cor', shape: 'circle', radius: 4, type: 'color', values: '#ff0000,#000000', createdAt: new Date(), updatedAt: new Date() },
      { product_id: 2, title: 'Tamanho', shape: 'square', radius: 4, type: 'text', values: '38,39,40', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ProductOptions', null, {});
    await queryInterface.bulkDelete('ProductImages', null, {});
    await queryInterface.bulkDelete('ProductCategories', null, {});
    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
