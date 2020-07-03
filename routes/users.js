const router = require('express').Router();
const usersControl = require('../controllers/users');

router.get('/', usersControl.getUsers);
router.get('/:id', usersControl.getUser);
router.post('/', usersControl.createUser);
router.patch('/:id', usersControl.updateUserName);
router.patch('/:id/avatar', usersControl.updateAvatar);

module.exports = router;
