const Card = require('../models/card');

const ERROR_CODE = 400;
const NOT_FOUND_CODE = 404;
const SERVER_ERROR_CODE = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res
      .status(SERVER_ERROR_CODE)
      .send({ message: `На сервере произошла ошибка: ${err.name}` }));
};

module.exports.createCard = (req, res) => {
  const id = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
        return;
      }
      res
        .status(SERVER_ERROR_CODE)
        .send({ message: `На сервере произошла ошибка: ${err.name}` });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (!req.params._id) {
        res.status(NOT_FOUND_CODE).send({
          message: `Карточка с указанным _id (${req.params.id}) не найдена`,
        });
        return;
      }
      res
        .status(SERVER_ERROR_CODE)
        .send({ message: `На сервере произошла ошибка: ${err.name}` });
    });
};

module.exports.putCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
        return;
      }
      if (!req.user._id) {
        res.status(NOT_FOUND_CODE).send({
          message: `Передан несуществующий _id (${req.params.id}) карточки`,
        });
        return;
      }
      res
        .status(SERVER_ERROR_CODE)
        .send({ message: `На сервере произошла ошибка: ${err.name}` });
    });
};

module.exports.deleteCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные для снятия лайка',
        });
        return;
      }
      if (!req.user._id) {
        res.status(NOT_FOUND_CODE).send({
          message: `Передан несуществующий _id (${req.params.id}) карточки`,
        });
        return;
      }
      res
        .status(SERVER_ERROR_CODE)
        .send({ message: `На сервере произошла ошибка: ${err.name}` });
    });
};

// getCards, createCard, deleteCard

// putCardLike, deleteCardLike
