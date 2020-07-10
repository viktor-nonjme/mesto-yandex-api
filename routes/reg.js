const router = require('express').Router();
const usersControl = require('../controllers/users');

router.post('/', usersControl.createUser);

module.exports = router;
