const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const auth = require('../middlewares/auth');

const regex = require('../utils/regex');

const {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
} = require('../controllers/cards');

router.use(auth);

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

router.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteCard,
);

router.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  putCardLike,
);

router.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteCardLike,
);

module.exports = router;

// GET /cards — возвращает все карточки
// POST /cards — создаёт карточку
// DELETE /cards/:cardId — удаляет карточку по идентификатору
