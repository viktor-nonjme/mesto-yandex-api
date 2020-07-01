const router = require('express').Router();
const users = require('../db/users.json');

router.get('/', (req, res) => {
  res.send(users);
});

router.get('/:id', (req, res) => {
  const user = users.find((u) => u._id === req.params.id);
  if (user) {
    res.send(user);
  }
  res.status(404).send({ message: 'Пользователя с таким id не существует' });
});

module.exports = router;

// router.patch('/:id', (req, res) => {
//   const user = users.find((u) => u._id === req.params.id);
//   if (user) {
//     user.name = req.body.name;
//     res.send(user);
//   }
//   res.status(404).send({ message: 'Произошла ошибка' });
// });

// router.put('/:id', (req, res) => {
//   const user = users.find((u) => u._id === req.params.id);
//   if (user) {
//     user.name = req.params.name;
//     res.send(user);
//   }
//   res.status(404).send({ message: 'Произошла ошибка' });
// });
