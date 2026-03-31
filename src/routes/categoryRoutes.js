const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const verifyToken = require('../middleware/auth'); // Trazendo o nosso "segurança"


router.get('/search', CategoryController.searchCategories);
router.get('/:id', CategoryController.getCategoryById);


router.post('/', verifyToken, CategoryController.createCategory);
router.put('/:id', verifyToken, CategoryController.updateCategory);
router.delete('/:id', verifyToken, CategoryController.deleteCategory);

module.exports = router;
