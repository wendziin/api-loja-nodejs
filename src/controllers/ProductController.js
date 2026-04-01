const { Op } = require('sequelize');
const { Product, Category, ProductImage, ProductOption } = require('../models');

const createProduct = async (req, res) => {
  try {
    const {
      enabled, name, slug, stock, description, price, price_with_discount,
      category_ids, images, options
    } = req.body;

    // 1. Cria o Produto base
    const product = await Product.create({
      enabled: enabled || false,
      name,
      slug,
      stock: stock || 0,
      description,
      price,
      price_with_discount
    });

    // 2. Associa as Categorias (Mágica do Sequelize!)
    if (category_ids && category_ids.length > 0) {
      // O método setCategories é gerado automaticamente por causa do belongsToMany
      await product.setCategories(category_ids);
    }

    // 3. Salva as Imagens na tabela ProductImages
    if (images && images.length > 0) {
      const imageRecords = images.map((img, index) => ({
        product_id: product.id,
        enabled: true,
        // Gera um caminho fictício simulando o salvamento da imagem no servidor
        path: `/media/${slug}/image-${index + 1}.${img.type.split('/')[1]}`
      }));
      await ProductImage.bulkCreate(imageRecords);
    }

    // 4. Salva as Opções na tabela ProductOptions
    if (options && options.length > 0) {
      const optionRecords = options.map(opt => ({
        product_id: product.id,
        title: opt.title,
        shape: opt.shape || 'square',

        radius: opt.radius ? parseInt(opt.radius.replace(/\D/g, '')) : 0,
        type: opt.type || 'text',

        values: opt.values ? opt.values.join(',') : (opt.value ? opt.value.join(',') : '')
      }));
      await ProductOption.bulkCreate(optionRecords);
    }

    // Retorna o status 201 Created
    return res.status(201).json({ message: 'Produto criado com sucesso!', product });
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao criar produto.', details: error.message });
  }
};

// ... código anterior (createProduct) ...

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Busca o produto e inclui os relacionamentos
    const product = await Product.findByPk(id, {
      include: [
        { model: Category, as: 'categories', attributes: ['id', 'name'] },
        { model: ProductImage, as: 'images', attributes: ['id', 'path'] },
        { model: ProductOption, as: 'options', attributes: ['id', 'title', 'shape', 'radius', 'type', 'values'] }
      ]
    });

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    // Formatando os dados para ficarem idênticos ao exigido no README
    const formattedProduct = {
      id: product.id,
      enabled: product.enabled,
      name: product.name,
      slug: product.slug,
      stock: product.stock,
      description: product.description,
      price: product.price,
      price_with_discount: product.price_with_discount,
      category_ids: product.categories.map(cat => cat.id),
      category_names: product.categories.map(cat => cat.name),
      images: product.images.map(img => ({
        id: img.id,
        content: img.path
      })),
      options: product.options.map(opt => ({
        id: opt.id,
        title: opt.title,
        shape: opt.shape,
        radius: opt.radius,
        type: opt.type,
        values: opt.values.split(',') // Transforma a string salva no banco de volta em Array
      }))
    };

    return res.status(200).json(formattedProduct);
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao buscar produto.', details: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }


    await product.destroy();

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao deletar produto.', details: error.message });
  }
};

// ... código anterior (create, getById, delete) ...

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      enabled, name, slug, stock, description, price, price_with_discount,
      category_ids, images, options
    } = req.body;

    // Busca o produto no banco
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    // 1. Atualiza os dados básicos da tabela Products
    if (enabled !== undefined) product.enabled = enabled;
    if (name) product.name = name;
    if (slug) product.slug = slug;
    if (stock !== undefined) product.stock = stock;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (price_with_discount !== undefined) product.price_with_discount = price_with_discount;

    await product.save();

    // 2. Atualiza as Categorias (substitui as antigas pelas novas)
    if (category_ids) {
      await product.setCategories(category_ids);
    }

    // 3. Lógica das Imagens (Adicionar, Manter ou Deletar)
    if (images && images.length > 0) {
      for (const img of images) {
        if (img.id && img.deleted) {
          // Se tem ID e deleted: true, apagamos a imagem do banco
          await ProductImage.destroy({ where: { id: img.id, product_id: id } });
        } else if (!img.id) {
          // Se não tem ID, é uma imagem nova sendo enviada
          await ProductImage.create({
            product_id: id,
            enabled: true,
            path: `/media/${product.slug}/new-image-${Date.now()}.${img.type ? img.type.split('/')[1] : 'jpg'}`
          });
        }
      }
    }

    // 4. Lógica das Opções (Adicionar, Atualizar ou Deletar)
    if (options && options.length > 0) {
      for (const opt of options) {
        if (opt.id && opt.deleted) {
          // Deleta a opção
          await ProductOption.destroy({ where: { id: opt.id, product_id: id } });
        } else if (opt.id) {
          // Atualiza a opção existente
          const existingOpt = await ProductOption.findOne({ where: { id: opt.id, product_id: id } });
          if (existingOpt) {
            if (opt.title) existingOpt.title = opt.title;
            if (opt.shape) existingOpt.shape = opt.shape;
            if (opt.radius !== undefined) {
              existingOpt.radius = typeof opt.radius === 'string' ? parseInt(opt.radius.replace(/\D/g, '')) : opt.radius;
            }
            if (opt.type) existingOpt.type = opt.type;
            if (opt.values || opt.value) {
              existingOpt.values = opt.values ? opt.values.join(',') : opt.value.join(',');
            }
            await existingOpt.save();
          }
        } else {
          // Cria uma opção nova se não mandou ID
          await ProductOption.create({
            product_id: id,
            title: opt.title,
            shape: opt.shape || 'square',
            radius: opt.radius ? parseInt(opt.radius.replace(/\D/g, '')) : 0,
            type: opt.type || 'text',
            values: opt.values ? opt.values.join(',') : (opt.value ? opt.value.join(',') : '')
          });
        }
      }
    }

    // Retorna 204 No Content conforme o escopo do projeto
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao atualizar produto.', details: error.message });
  }
};

// ... código anterior (create, getById, delete, update) ...

const searchProducts = async (req, res) => {
  try {
    let { limit = 12, page = 1, fields, match, category_ids, 'price-range': priceRange, option } = req.query;

    limit = parseInt(limit);
    page = parseInt(page);

    const whereClause = {};

    // Filtro 1: Match (busca no nome ou na descrição)
    if (match) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${match}%` } },
        { description: { [Op.like]: `%${match}%` } }
      ];
    }

    // Filtro 2: Range de Preço (ex: 100-200)
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      whereClause.price = { [Op.between]: [min, max] };
    }

    const includeClause = [];

    // Filtro 3: Categorias (traz apenas produtos que pertençam aos IDs informados)
    if (category_ids) {
      const ids = category_ids.split(',').map(Number);
      includeClause.push({
        model: Category,
        as: 'categories',
        where: { id: { [Op.in]: ids } },
        attributes: ['id', 'name'],
        through: { attributes: [] } // Esconde a tabela de junção da resposta
      });
    } else {
      includeClause.push({ model: Category, as: 'categories', attributes: ['id', 'name'], through: { attributes: [] } });
    }

    // Incluindo Imagens e Opções para a formatação
    includeClause.push({ model: ProductImage, as: 'images', attributes: ['id', 'path'] });
    
    // Filtro 4: Options (ex: option[45]=GG,PP)
    const optionInclude = { model: ProductOption, as: 'options', attributes: ['id', 'title', 'shape', 'radius', 'type', 'values'] };
    if (option) {
      // Se vier filtro de opção, extraímos as chaves (IDs) para filtrar
      const optionIds = Object.keys(option).map(Number);
      optionInclude.where = { id: { [Op.in]: optionIds } };
    }
    includeClause.push(optionInclude);

    // Selecionando os campos específicos se a query "fields" for enviada
    let attributesInclude = undefined;
    if (fields) {
      const fieldList = fields.split(',');
      // Filtramos apenas as colunas que existem de verdade na tabela Products
      attributesInclude = fieldList.filter(f => !['images', 'options', 'category_ids'].includes(f));
      if (!attributesInclude.includes('id')) attributesInclude.push('id'); // ID é obrigatório
    }

    // Fazendo a busca no banco (distinct: true é essencial para a contagem não bugar por causa das imagens/categorias)
    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      include: includeClause,
      attributes: attributesInclude,
      limit: limit !== -1 ? limit : undefined,
      offset: limit !== -1 ? (page - 1) * limit : undefined,
      distinct: true
    });

    // Formatando o resultado final para ficar idêntico ao README
    const formattedData = rows.map(product => {
      const prodJson = product.toJSON();
      
      return {
        id: prodJson.id,
        enabled: prodJson.enabled,
        name: prodJson.name,
        slug: prodJson.slug,
        stock: prodJson.stock,
        description: prodJson.description,
        price: prodJson.price,
        price_with_discount: prodJson.price_with_discount,
        category_ids: prodJson.categories ? prodJson.categories.map(cat => cat.id) : [],
        category_names: prodJson.categories ? prodJson.categories.map(cat => cat.name) : [],
        images: prodJson.images ? prodJson.images.map(img => ({ id: img.id, content: img.path })) : [],
        options: prodJson.options ? prodJson.options.map(opt => ({
          id: opt.id,
          title: opt.title,
          shape: opt.shape,
          radius: opt.radius,
          type: opt.type,
          values: opt.values ? opt.values.split(',') : []
        })) : []
      };
    });

    return res.status(200).json({
      data: formattedData,
      total: count,
      limit,
      page: limit !== -1 ? page : 1
    });

  } catch (error) {
    return res.status(400).json({ error: 'Erro ao buscar produtos.', details: error.message });
  }
};

module.exports = {
  createProduct,
  getProductById,
  deleteProduct,
  updateProduct,
  searchProducts
};