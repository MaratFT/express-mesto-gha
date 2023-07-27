const User = require('../models/user');

const ERROR_CODE = 400;
const NOT_FOUND_CODE = 404;
const SERVER_ERROR_CODE = 500;

// if (err.name === 'SomeErrorName') return res.status(ERROR_CODE).send(...)

/*

catch(err => {
if (err.name === 'ValidationError') {
next(err)
} else {
next(err)
}
})

 */

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res
      .status(SERVER_ERROR_CODE)
      .send({ message: `На сервере произошла ошибка: ${err.name}` }));
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_CODE).send({
          message: `Пользователь по указанному _id (${userId}) не найден`,
        });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(ERROR_CODE).send({
          message: 'Невалидные данные',
        });
        return;
      }
      res
        .status(SERVER_ERROR_CODE)
        .send({ message: `На сервере произошла ошибка: ${err.name}` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
        return;
      }
      res
        .status(SERVER_ERROR_CODE)
        .send({ message: `На сервере произошла ошибка: ${err.name}` });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
        return;
      }
      if (!req.user._id) {
        res.status(NOT_FOUND_CODE).send({
          message: `Пользователь с указанным _id (${req.user._id}) не найден`,
        });
        return;
      }
      res
        .status(SERVER_ERROR_CODE)
        .send({ message: `На сервере произошла ошибка: ${err.name}` });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
        return;
      }
      if (!req.user._id) {
        res.status(NOT_FOUND_CODE).send({
          message: `Пользователь с указанным _id (${req.user._id}) не найден`,
        });
        return;
      }
      res
        .status(SERVER_ERROR_CODE)
        .send({ message: `На сервере произошла ошибка: ${err.name}` });
    });
};
