const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('receipt'), expenseController.submitExpense);
router.get('/', protect, expenseController.getExpenses);
router.post('/approve/:id', protect, authorize('manager', 'admin'), expenseController.approveExpense);

module.exports = router;
