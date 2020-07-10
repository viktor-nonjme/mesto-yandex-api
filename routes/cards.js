const router = require('express').Router();
const cardsControl = require('../controllers/cards');
const { auth } = require('../middlewares/auth');

router.use(auth);

router.get('/', cardsControl.getCards);
router.post('/', cardsControl.createCard);
router.delete('/:id', cardsControl.deleteCard);
router.put('/:id/likes', cardsControl.likeCard);
router.delete('/:id/likes', cardsControl.dislikeCard);

module.exports = router;
