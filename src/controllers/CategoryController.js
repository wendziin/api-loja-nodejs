const { Category } = require('../models');

const createCategory = async (req, res) => {
  try {
    const { name, slug, use_in_menu } = req.body;

    // Validação básica
    if (!name || !slug) {
      return res.status(400).json({ error: 'Os campos name e slug são obrigatórios.' });
    }

    // Criando a categoria no banco
    const category = await Category.create({
      name,
      slug,
      use_in_menu: use_in_menu || false
    });

    return res.status(201).json(category);
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao criar categoria.', details: error.message });
  }
};

// ... código anterior (createCategory) ...

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, use_in_menu } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    if (name) category.name = name;
    if (slug) category.slug = slug;
    if (use_in_menu !== undefined) category.use_in_menu = use_in_menu;

    await category.save();

    // 204 No Content (exigência do escopo)
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao atualizar categoria.', details: error.message });
  }
};

// ... código anterior (createCategory e updateCategory) ...

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, {
      // O README pede para retornar apenas estes campos
      attributes: ['id', 'name', 'slug', 'use_in_menu']
    });

    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    return res.status(200).json(category);
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao buscar categoria.', details: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    await category.destroy();

    return res.status(204).send(); // Exigência do Requisito 05
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao deletar categoria.', details: error.message });
  }
};

const searchCategories = async (req, res) => {
  try {
    // Puxando as query strings da URL com valores padrão (Requisito 01)
    let { limit = 12, page = 1, fields, use_in_menu } = req.query;

    limit = parseInt(limit);
    page = parseInt(page);

    const options = {
      where: {}
    };

    // Filtro: use_in_menu
    if (use_in_menu !== undefined) {
      options.where.use_in_menu = use_in_menu === 'true' || use_in_menu === '1';
    }

    // Filtro: fields (quais colunas retornar)
    if (fields) {
      options.attributes = fields.split(',');
    } else {
      options.attributes = ['id', 'name', 'slug', 'use_in_menu']; // Padrão
    }

    // Paginação: Se limit for diferente de -1, aplicamos limite e offset (pulo)
    if (limit !== -1) {
      options.limit = limit;
      options.offset = (page - 1) * limit;
    }

    // findAndCountAll é perfeito para paginação, pois já devolve o total de itens no banco
    const { count, rows } = await Category.findAndCountAll(options);

    return res.status(200).json({
      data: rows,
      total: count,
      limit,
      page: limit !== -1 ? page : 1
    });

  } catch (error) {
    return res.status(400).json({ error: 'Erro ao buscar categorias.', details: error.message });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  getCategoryById,
  deleteCategory,
  searchCategories
};