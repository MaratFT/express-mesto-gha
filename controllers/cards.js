const Card = require('../models/card');

// const ERROR_CODE = 400;
// const NOT_FOUND_CODE = 404;
// const SERVER_ERROR_CODE = 500;

const CREATED_CODE = 201;

// const BadRequestError = require("../errors/bad-request-error");
// const ExistsDatabaseError = require('../errors/exists-database-error');
const NotFoundError = require('../errors/not-found-err');
// const ServerError = require('../errors/server-error');
// const UnauthorizedError = require('../errors/unauthorized-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const id = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: id })
    .then((card) => res.status(CREATED_CODE).send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(
          `Карточка с указанным _id (${req.params.cardId}) не найдена`,
        );
      }
      if (req.user._id != card.owner) {
        throw new ForbiddenError(
          `Карточка другого пользователя (${card.owner})`,
        );
      }
      Card.findByIdAndRemove(card).then((cardDelete) => res.send(cardDelete));
    })
    .catch(next);
};

module.exports.putCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(
          `Передан несуществующий _id (${req.params.cardId}) карточки`,
        );
      }
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.deleteCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(
          `Передан несуществующий _id (${req.params.cardId}) карточки`,
        );
      }
      res.send({ data: card });
    })
    .catch(next);
};

// getCards, createCard, deleteCard

// putCardLike, deleteCardLike
