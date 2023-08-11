const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

// const auth = require("../middlewares/auth");

const regex = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/;

const {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(new RegExp(regex)),
    }),
  }),
  createCard,
);

router.delete('/cards/:cardId', deleteCard);

router.put('/cards/:cardId/likes', putCardLike);

router.delete('/cards/:cardId/likes', deleteCardLike);

module.exports = router;

// GET /cards — возвращает все карточки
// POST /cards — создаёт карточку
// DELETE /cards/:cardId — удаляет карточку по идентификатору
