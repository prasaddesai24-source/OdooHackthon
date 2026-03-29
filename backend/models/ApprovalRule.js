const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');
const Company = require('./Company');

const ApprovalRule = sequelize.define('ApprovalRule', {
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Company,
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('percentage', 'specific', 'hybrid'),
    allowNull: false
  },
  threshold_percentage: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  is_manager_approver: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  config: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'approval_rules',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = ApprovalRule;
