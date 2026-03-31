const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const verifyToken = require('../middleware/auth');

// Rota POST /v1/user
router.post('/', UserController.createUser);
router.get('/:id', UserController.getUserById);
router.post('/token', UserController.generateToken);

router.put('/:id', verifyToken, UserController.updateUser);
router.delete('/:id', verifyToken, UserController.deleteUser);


module.exports = router;
