const bcrypt = require('bcryptjs');
const { User } = require('../models');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
  try {
    const { firstname, surname, email, password, confirmPassword } = req.body;

    // Validação básica
    if (!firstname || !surname || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'As senhas não coincidem.' });
    }

    // Verifica se o email já existe
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return res.status(400).json({ error: 'Email já cadastrado.' });
    }

    // Gerando o hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Criando o usuário no banco de dados
    await User.create({
      firstname,
      surname,
      email,
      password: hashedPassword
    });

    return res.status(201).json({ message: 'Usuário criado com sucesso.' });
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao processar a requisição.', details: error.message });
  }
};

// ... código anterior do createUser ...

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Busca o usuário pela chave primária, selecionando apenas os campos exigidos no escopo
    const user = await User.findByPk(id, {
      attributes: ['id', 'firstname', 'surname', 'email']
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao buscar usuário.', details: error.message });
  }
};

const generateToken = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    // Busca o usuário no banco
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Usuário ou senha incorretos.' });
    }

    // Compara a senha digitada com o hash salvo no banco
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Usuário ou senha incorretos.' });
    }

    // Gera o token JWT com duração de 1 dia
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao gerar token.', details: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, surname, email } = req.body;

    // Busca o usuário pelo ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Atualiza apenas os campos enviados (Requisito 04)
    if (firstname) user.firstname = firstname;
    if (surname) user.surname = surname;
    if (email) user.email = email;

    await user.save();

    // 204 No Content significa sucesso, mas sem retornar corpo (exigência do README)
    return res.status(204).send(); 
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao atualizar.', details: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Exclui o usuário do banco
    await user.destroy();

    // 204 No Content
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao deletar.', details: error.message });
  }
};


module.exports = {
  createUser,
  getUserById,
  generateToken,
  updateUser,
  deleteUser
};


