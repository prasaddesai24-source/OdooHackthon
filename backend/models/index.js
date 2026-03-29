const Company = require('./Company');
const User = require('./User');
const Expense = require('./Expense');
const ApprovalRule = require('./ApprovalRule');
const ApprovalStep = require('./ApprovalStep');
const ExpenseApproval = require('./ExpenseApproval');

// Relationships
Company.hasMany(User, { foreignKey: 'company_id' });
User.belongsTo(Company, { foreignKey: 'company_id' });

User.hasMany(User, { as: 'Subordinates', foreignKey: 'manager_id' });
User.belongsTo(User, { as: 'Manager', foreignKey: 'manager_id' });

User.hasMany(Expense, { foreignKey: 'user_id' });
Expense.belongsTo(User, { foreignKey: 'user_id' });

Company.hasOne(ApprovalRule, { foreignKey: 'company_id' });
ApprovalRule.belongsTo(Company, { foreignKey: 'company_id' });

Company.hasMany(ApprovalStep, { foreignKey: 'company_id' });
ApprovalStep.belongsTo(Company, { foreignKey: 'company_id' });

Expense.hasMany(ExpenseApproval, { foreignKey: 'expense_id' });
ExpenseApproval.belongsTo(Expense, { foreignKey: 'expense_id' });

User.hasMany(ExpenseApproval, { foreignKey: 'approver_id' });
ExpenseApproval.belongsTo(User, { foreignKey: 'approver_id' });

module.exports = {
  Company,
  User,
  Expense,
  ApprovalRule,
  ApprovalStep,
  ExpenseApproval
};
