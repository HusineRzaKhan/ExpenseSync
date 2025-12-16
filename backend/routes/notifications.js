const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Placeholder endpoints for notification events (real push requires FCM/APNs)
router.post('/instant', auth, (req, res) => {
  // create instant notification on server side (store or dispatch)
  res.json({ message: 'Instant notification recorded (placeholder)' });
});

router.post('/daily-summary', auth, (req, res) => {
  res.json({ message: 'Daily summary queued (placeholder)' });
});

router.post('/weekly-summary', auth, (req, res) => {
  res.json({ message: 'Weekly summary queued (placeholder)' });
});

module.exports = router;
