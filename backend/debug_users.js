require('dotenv').config();
const { User } = require('./models');
const { sequelize } = require('./database/db');

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');
    const users = await User.findAll();
    console.log('--- USER DATA ---');
    users.forEach(u => {
      console.log(`ID: ${u.id}, Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`);
    });
    console.log('--- END DATA ---');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
}

run();
