const { Expense, User, Company, ApprovalRule, ExpenseApproval } = require('../models');
const { processReceipt, getConversionRate } = require('../services/ocrService');
const workflowService = require('../services/workflowService');

exports.submitExpense = async (req, res) => {
  try {
    const { amount, currency, category, description, date } = req.body;
    const { id: user_id, company_id } = req.user;
    
    const company = await Company.findByPk(company_id);
    const receipt_url = req.file ? req.file.path : null;

    // 1. Get conversion rate to company's base currency
    const rate = await getConversionRate(currency, company.base_currency);
    const amount_in_base_currency = (amount * rate).toFixed(2);

    // 2. OCR (if receipt exists)
    let ocr_data = null;
    if (receipt_url) {
      ocr_data = await processReceipt(receipt_url);
    }

    // 3. Create Expense Record
    const expense = await Expense.create({
      user_id,
      amount,
      currency,
      amount_in_base_currency,
      category,
      description: ocr_data && ocr_data.success ? `${description} (OCR: ${ocr_data.data.vendor_name})` : description,
      receipt_url,
      date,
      status: 'pending'
    });

    // 4. Trigger Approval Workflow
    await workflowService.initiateWorkflow(expense.id, company_id, user_id);

    res.status(201).json({ success: true, expense });
  } catch (error) {
    console.log('Expense Submission Error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const { id: user_id, role, company_id } = req.user;
    let expenses;

    if (role === 'admin') {
      expenses = await Expense.findAll({ 
        include: [{ model: User, where: { company_id } }, { model: ExpenseApproval, order: [['createdAt', 'DESC']] }] 
      });
    } else if (role === 'manager') {
      expenses = await Expense.findAll({
        where: { status: ['pending', 'in_progress'] },
        include: [{ model: User, where: { company_id, manager_id: user_id } }, { model: ExpenseApproval }]
      });
    } else {
      expenses = await Expense.findAll({ 
        where: { user_id },
        include: [{ model: ExpenseApproval, order: [['createdAt', 'DESC']] }]
      });
    }

    // --- AI Risk Engine (Hackathon Feature) ---
    // Dynamically evaluate all fetched expenses for risk flags
    const enrichedExpenses = expenses.map(exp => {
        const plainExp = exp.get ? exp.get({ plain: true }) : exp;
        const flags = [];
        let riskScore = 0;

        // Rule 1: Weekend Spending
        const expDate = new Date(plainExp.date);
        const day = expDate.getDay();
        if (day === 0 || day === 6) {
            flags.push('Weekend Spending');
            riskScore += 40;
        }

        // Rule 2: High Amount Outlier
        if (parseFloat(plainExp.amount_in_base_currency) > 1000) {
            flags.push('Unusually High Amount');
            riskScore += 50;
        }

        // Rule 3: Missing receipt (if we had a strict policy)
        if (!plainExp.receipt_url) {
            flags.push('No Receipt Attached');
            riskScore += 20;
        }

        // Determine badge tier
        plainExp.risk_level = riskScore >= 70 ? 'high' : riskScore >= 40 ? 'medium' : 'low';
        plainExp.risk_flags = flags;
        
        return plainExp;
    });

    res.json({ success: true, expenses: enrichedExpenses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.approveExpense = async (req, res) => {
  try {
    const { status, comment } = req.body;
    const { id: approver_id } = req.user;
    const { id: expense_id } = req.params;

    const result = await workflowService.processApproval(expense_id, approver_id, status, comment);
    
    if (result.success) {
      res.json({ success: true, message: `Expense ${status}` });
    } else {
      res.status(400).json({ success: false, message: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
