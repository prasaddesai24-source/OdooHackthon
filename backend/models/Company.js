const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const Company = sequelize.define('Company', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  base_currency: {
    type: DataTypes.STRING(10),
    defaultValue: 'USD'
  },
  country_code: {
    type: DataTypes.STRING(5),
    allowNull: false
  }
}, {
  tableName: 'companies',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Company;
