const router = require('express').Router();
const users = require('./users');
const cards = require('./users');

router.use('/users', users);
router.use('/cards', cards);

module.exports = router;
