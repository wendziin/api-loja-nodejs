const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Pega o token do cabeçalho da requisição
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  // O formato esperado é "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Token mal formatado.' });
  }

  const token = parts[1];

  try {
    // Verifica se o token é válido e não expirou
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    
    req.userId = decoded.id; 
    
    return next(); 
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

module.exports = verifyToken;
