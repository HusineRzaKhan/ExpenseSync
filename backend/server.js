const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const notificationRoutes = require('./routes/notifications');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/expensesync';

mongoose.connect(MONGO).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}).catch(err => {
  console.error('MongoDB connection error', err);
});
