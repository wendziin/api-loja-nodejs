const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const verifyToken = require('../middleware/auth');

router.get('/search', ProductController.searchProducts);
router.get('/', ProductController.searchProducts); // Adicionado para suportar a busca principal
router.get('/:id', ProductController.getProductById);

// Rota POST /v1/product (Protegida)
router.post('/', verifyToken, ProductController.createProduct);
router.put('/:id', verifyToken, ProductController.updateProduct);
router.delete('/:id', verifyToken, ProductController.deleteProduct);

module.exports = router;
