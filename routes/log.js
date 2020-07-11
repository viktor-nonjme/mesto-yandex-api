const router = require('express').Router();
const usersControl = require('../controllers/users');
const checkPassword = require('../middlewares/checkpassword');

router.post('/', checkPassword, usersControl.login);

module.exports = router;
