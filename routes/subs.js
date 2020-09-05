const express = require('express');
const router = express.Router();

router.get('/meeting-room', (req,res) => {
  res.render('editor');
})
module.exports = router;
