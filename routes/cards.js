const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', createCard);

router.delete('/cards/:id', deleteCard);

router.put('/cards/:id/likes', putCardLike);

router.delete('/cards/:id/likes', deleteCardLike);

module.exports = router;

// GET /cards — возвращает все карточки
// POST /cards — создаёт карточку
// DELETE /cards/:cardId — удаляет карточку по идентификатору
