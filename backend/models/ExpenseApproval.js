const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');
const Expense = require('./Expense');
const User = require('./User');

const ExpenseApproval = sequelize.define('ExpenseApproval', {
  expense_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Expense,
      key: 'id'
    }
  },
  approver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('approved', 'rejected'),
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  step_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'expense_approvals',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = ExpenseApproval;
