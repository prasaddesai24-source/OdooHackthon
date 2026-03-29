const bcrypt = require('bcryptjs');
const { User } = require('../models');

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, manager_id } = req.body;
    const { company_id } = req.user; // From auth middleware

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password_hash,
      role,
      company_id,
      manager_id: manager_id || null,
      team: req.body.team || null
    });

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        team: user.team
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { company_id } = req.user;
    const users = await User.findAll({
      where: { company_id },
      attributes: ['id', 'name', 'email', 'role', 'manager_id', 'team']
    });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getManagers = async (req, res) => {
  try {
    const { company_id } = req.user;
    const managers = await User.findAll({
      where: { company_id, role: ['admin', 'manager'] },
      attributes: ['id', 'name', 'role']
    });
    res.json({ success: true, managers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
