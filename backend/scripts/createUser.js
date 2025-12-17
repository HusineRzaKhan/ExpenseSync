const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/User');

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/expensesync';

async function createUser(email, password, name = 'Seed User') {
  await mongoose.connect(MONGO);
  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists:', email);
      return process.exit(0);
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    user = new User({ name, email, password: hashed });
    await user.save();
    console.log('Created user', email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node createUser.js <email> <password> [name]');
  process.exit(1);
}

createUser(args[0], args[1], args[2]);
