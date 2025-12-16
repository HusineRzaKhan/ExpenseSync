const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// Create transaction
router.post('/', auth, async (req, res) => {
  try {
    const data = { ...req.body, user: req.user.id };
    const tx = new Transaction(data);
    await tx.save();
    res.json(tx);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get transactions (optionally by date)
router.get('/', auth, async (req, res) => {
  try {
    const { date } = req.query;
    let query = { user: req.user.id };
    if (date) {
      const d = new Date(date);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      query.date = { $gte: d, $lt: next };
    }
    const list = await Transaction.find(query).sort({ date: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get daily totals for calendar view (simple aggregation)
router.get('/daily-totals', auth, async (req, res) => {
  try {
    const totals = await Transaction.aggregate([
      { $match: { user: require('mongoose').Types.ObjectId(req.user.id) } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, total: { $sum: "$amount" } } },
      { $sort: { _id: 1 } }
    ]);
    res.json(totals);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
