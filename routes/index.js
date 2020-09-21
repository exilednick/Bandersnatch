const express = require('express');
const router = express.Router();

router.get('/subs/meeting-room', (req,res) => {
  res.render('editor');
});

router.get('/', function(req, res) {
  res.render('index');
});

module.exports = router;
