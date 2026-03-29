const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');
const Company = require('./Company');
const User = require('./User');

const ApprovalStep = sequelize.define('ApprovalStep', {
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Company,
      key: 'id'
    }
  },
  step_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  approver_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  role_target: {
    type: DataTypes.ENUM('manager', 'finance', 'director'),
    allowNull: true
  }
}, {
  tableName: 'approval_steps',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = ApprovalStep;
