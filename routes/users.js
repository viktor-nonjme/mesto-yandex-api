const router = require('express').Router();
const usersControl = require('../controllers/users');
const { auth } = require('../middlewares/auth');

router.use(auth);

router.get('/', usersControl.getUsers);
router.get('/:id', usersControl.getUser);
router.patch('/:id', usersControl.updateUserName);
router.patch('/:id/avatar', usersControl.updateAvatar);

module.exports = router;
