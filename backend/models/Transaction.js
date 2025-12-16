const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income','expense'], default: 'expense' },
  category: { type: String, default: 'other' },
  date: { type: Date, default: Date.now },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
