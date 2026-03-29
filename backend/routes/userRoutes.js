const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin'), userController.createUser);
router.get('/', protect, authorize('admin'), userController.getUsers);
router.get('/managers', protect, userController.getManagers);

module.exports = router;
