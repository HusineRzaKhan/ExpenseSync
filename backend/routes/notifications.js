const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');

// Get notifications for signed-in user
router.get('/', auth, async (req, res) => {
  try {
    const list = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Create a notification for the signed-in user
router.post('/', auth, async (req, res) => {
  try {
    const { title, body } = req.body;
    const n = new Notification({ user: req.user.id, title, body });
    await n.save();
    res.json(n);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const n = await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { $set: { read: true } }, { new: true });
    if (!n) return res.status(404).json({ message: 'Not found' });
    res.json(n);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
