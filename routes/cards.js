const router = require('express').Router();
const cards = require('../db/cards.json');

router.get('/', (req, res) => {
  res.send(cards);
});

module.exports = router;
