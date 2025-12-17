const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');
const axios = require('axios');

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

// Update transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const tx = await Transaction.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { $set: req.body }, { new: true });
    if (!tx) return res.status(404).json({ message: 'Not found' });
    res.json(tx);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const tx = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!tx) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Export transactions as CSV between dates: /export?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/export', auth, async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = { user: req.user.id };
    if (from) {
      const f = new Date(from);
      const t = to ? new Date(to) : new Date();
      t.setDate(t.getDate() + 1);
      query.date = { $gte: f, $lt: t };
    }
    const list = await Transaction.find(query).sort({ date: 1 });
    // build CSV
    const header = 'date,amount,type,category,notes\n';
    const rows = list.map(r => `${new Date(r.date).toISOString()},${r.amount},${r.type},${r.category},"${(r.notes||'').replace(/"/g,'""')}"`).join('\n');
    const csv = header + rows;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Export transactions as PDF with chart image
router.get('/export/pdf', async (req, res) => {
  try {
    // support token in Authorization header or token query param
    const token = req.header('Authorization')?.split(' ')[1] || req.query.token;
    if (!token) return res.status(401).json({ message: 'No token' });
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      userId = decoded.user.id;
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { from, to } = req.query;
    const query = { user: userId };
    if (from) {
      const f = new Date(from);
      const t = to ? new Date(to) : new Date();
      t.setDate(t.getDate() + 1);
      query.date = { $gte: f, $lt: t };
    }
    const list = await Transaction.find(query).sort({ date: 1 });

    // aggregate per day or per category for chart
    const byCategory = {};
    list.forEach(r => {
      const cat = r.category || 'other';
      byCategory[cat] = (byCategory[cat] || 0) + (r.amount || 0);
    });

    const labels = Object.keys(byCategory);
    const data = labels.map(l => Math.round(byCategory[l]));

    // Build QuickChart URL for a bar chart (free image generation)
    const chartConfig = {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Spending', data }] },
      options: { legend: { display: false }, title: { display: true, text: 'Spending by Category' } }
    };

    const quickChartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`;

    // fetch chart image
    let chartBuffer = null;
    try {
      const chartResp = await axios.get(quickChartUrl, { responseType: 'arraybuffer' });
      chartBuffer = chartResp.data;
    } catch (err) {
      chartBuffer = null;
    }

    // create PDF
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="expenses_report.pdf"');
    doc.pipe(res);

    doc.fontSize(20).text('ExpenseSync Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Period: ${from || 'start'} - ${to || 'now'}`);
    doc.moveDown();

    // totals
    const total = list.reduce((s, r) => s + (r.amount || 0), 0);
    doc.fontSize(14).text(`Total spending: ${total}`);
    doc.moveDown();

    if (chartBuffer) {
      try {
        doc.image(chartBuffer, { width: 480 });
        doc.moveDown();
      } catch (e) {
        // ignore
      }
    }

    doc.fontSize(12).text('Breakdown by category:', { underline: true });
    labels.forEach(l => doc.text(`${l}: ${byCategory[l]}`));
    doc.moveDown();

    doc.fontSize(12).text('Transactions:', { underline: true });
    list.forEach(r => {
      doc.text(`${new Date(r.date).toLocaleString()} | ${r.category} | ${r.amount} | ${r.notes || ''}`);
    });

    doc.end();
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
