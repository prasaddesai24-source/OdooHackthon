const { Expense, ApprovalStep, User, Company, ApprovalRule, ExpenseApproval } = require('../models');

exports.initiateWorkflow = async (expenseId, companyId, userId) => {
  try {
    const expense = await Expense.findByPk(expenseId);
    const company = await Company.findByPk(companyId, { include: [ApprovalRule] });
    const user = await User.findByPk(userId);

    // 1. Get sequential steps
    const steps = await ApprovalStep.findAll({
      where: { company_id: companyId },
      order: [['step_number', 'ASC']]
    });

    if (steps.length === 0) {
      // Fallback: If no steps, check if manager approval is needed
      if (company.ApprovalRule.is_manager_approver && user.manager_id) {
        // Auto-assign to manager as first step
        expense.status = 'pending';
        await expense.save();
        return { success: true, message: 'Assigned to manager' };
      } else {
        // Auto-approve if no rules/managers
        expense.status = 'approved';
        await expense.save();
        return { success: true, message: 'Auto-approved (no rules)' };
      }
    }

    // 2. Set current step
    expense.status = 'in_progress';
    await expense.save();
    return { success: true, message: 'Workflow initiated' };
  } catch (error) {
    console.error('Workflow Error:', error.message);
    return { success: false, error: error.message };
  }
};

exports.processApproval = async (expenseId, approverId, status, comment) => {
  try {
    const expense = await Expense.findByPk(expenseId);
    const approver = await User.findByPk(approverId);
    // Use approver's company_id instead of expense.company_id (which doesn't exist)
    const company = await Company.findByPk(approver.company_id, { include: [ApprovalRule] });

    if (!company || !company.ApprovalRule) {
      throw new Error("Approval Rule or Company not found for this user.");
    }

    // 1. Log the approval
    await ExpenseApproval.create({
      expense_id: expenseId,
      approver_id: approverId,
      status,
      comment,
      step_number: 1 // TODO: Track current step number
    });

    if (status === 'rejected') {
      expense.status = 'rejected';
      await expense.save();
      return { success: true, status: 'rejected' };
    }

    // 2. Evaluate Conditional Rule (Percentage/Specific/Hybrid)
    const rule = company.ApprovalRule;
    if (rule.type === 'specific') {
      const config = rule.config || {};
      if (config.approver_id === approverId) {
        expense.status = 'approved';
        await expense.save();
        return { success: true, status: 'approved' };
      }
    }

    // Hybrid/Percentage logic: 
    // If multiple approvers are needed, we check if threshold is met.
    // For now, simplify to "Sequential" unless rule is met.
    
    // Check if next step exists
    // (Logic placeholder: move through steps)
    
    expense.status = 'approved'; // Simplified final state
    await expense.save();
    return { success: true, status: 'approved' };
  } catch (error) {
    console.error('Approval Process Error:', error.message);
    return { success: false, error: error.message };
  }
};
