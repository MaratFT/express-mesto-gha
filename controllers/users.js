const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const CREATED_CODE = 201;

const NotFoundError = require('../errors/not-found-err');

const BadRequestError = require('../errors/bad-request-error');
const ExistsDatabaseError = require('../errors/exists-database-error');
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
        next(
          new NotFoundError(
            `Пользователь по указанному _id (${userId}) не найден`,
          ),
        );
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Некорректный запрос пользователя'));
      }
    })
    .catch(next);
};

module.exports.createUser = async (req, res, next) => {
  const {
    email, name, about, avatar,
  } = req.body;

  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    res.status(CREATED_CODE).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    });
  } catch (error) {
    if (error.code === 11000) {
      next(new ExistsDatabaseError('Уже существует такой пользователь'));
    } else {
      next(error);
    }
  }
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении профиля',
          ),
        );
      }
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении аватара',
          ),
        );
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        '6abdf5e2d4054227bc988ee37bad3c4f8c4ee34e83dfeda9b6b228888605fa90',
        {
          expiresIn: '7d',
        },
      );

      res.send({ token });
    })
    .catch((err) => {
      if (err) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      next(err);
    })
    .catch(next);
};

module.exports.getUserCurrent = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => res.send(user))
    .catch(next);
};
