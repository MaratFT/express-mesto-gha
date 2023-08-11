const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// const ERROR_CODE = 400;
// const NOT_FOUND_CODE = 404;
// const SERVER_ERROR_CODE = 500;
// const UNAUTHORIZED_ERROR_CODE = 401;

const CREATED_CODE = 201;

const NotFoundError = require('../errors/not-found-err');

// // const BadRequestError = require('../errors/bad-request-error');
// const ExistsDatabaseError = require('../errors/exists-database-error');

// // const ServerError = require('../errors/server-error');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(
          `Пользователь по указанному _id (${userId}) не найден`,
        );
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, name, about, avatar,
  } = req.body;

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => res.status(CREATED_CODE).send({ data: user }))
        .catch((error) => {
          if (error.code === 11000) {
            res
              .status(409)
              .send({ message: 'Уже существует такой пользователь' });
          } else {
            next(error);
          }
        });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { runValidators: true, new: true },
  )
    .then((user) => {
      // if (!user) {
      //   throw new NotFoundError(
      //     `Пользователь с указанным _id (${req.user._id}) не найден`
      //   );
      // }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { runValidators: true, new: true },
  )
    .then((user) => {
      // if (!user) {
      //   throw new NotFoundError(
      //     `Пользователь с указанным _id (${req.user._id}) не найден`
      //   );
      // }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      const token = jwt.sign(
        { _id: user._id },
        '6abdf5e2d4054227bc988ee37bad3c4f8c4ee34e83dfeda9b6b228888605fa90',
        {
          expiresIn: '7d',
        },
      );

      res.send({ token });
    })
    .catch(next);
};

module.exports.getUserCurrent = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => res.send(user))
    .catch(next);
};
