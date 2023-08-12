const Card = require('../models/card');

const CREATED_CODE = 201;

const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-err');
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании карточки',
          ),
        );
      }
    })
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
      Card.deleteOne(card).then((cardDelete) => res.send(cardDelete));
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Некорректный запрос карточки'));
      }
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
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(
          new BadRequestError(
            'Переданы некорректные данные для постановки лайка',
          ),
        );
      }
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
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(
          new BadRequestError('Переданы некорректные данные для снятия лайка'),
        );
      }
    })
    .catch(next);
};
