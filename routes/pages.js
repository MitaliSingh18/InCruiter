const express = require('express');
const router = express.Router();
const path = require('path');

// Serve reset password page
router.get('/reset-password/:token', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../pages/reset-password.html'));
});

module.exports = router;