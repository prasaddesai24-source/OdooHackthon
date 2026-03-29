const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Company, ApprovalRule } = require('../models');

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, company_name, country_code, currency } = req.body;

    // 1. Create Company
    const company = await Company.create({
      name: company_name,
      country_code: country_code,
      base_currency: currency
    });

    // 2. Create Admin User
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password_hash,
      role: 'admin',
      company_id: company.id
    });

    // 3. Create Default Approval Rule for the company
    await ApprovalRule.create({
      company_id: company.id,
      type: 'percentage',
      threshold_percentage: 100,
      is_manager_approver: true
    });

    // 4. Generate Token
    const token = jwt.sign(
      { id: user.id, role: user.role, company_id: user.company_id },
      process.env.SECRET_KEY || process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        company: company.name
      }
    });
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ 
      where: { email },
      include: [{ model: Company }] 
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, company_id: user.company_id },
      process.env.SECRET_KEY || process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        company: user.Company.name
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
