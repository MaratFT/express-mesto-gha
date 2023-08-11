const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const regex = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/;

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getUserCurrent,
  // getToken,
} = require('../controllers/users');

router.get(
  '/users',
  auth,
  // (req, res) => res.append("Authorization", `Bearer ${getToken}`),
  getUsers,
);

router.get('/users/me', auth, getUserCurrent);

router.get('/users/:userId', auth, getUser);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  auth,
  updateUser,
);

router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(new RegExp(regex)),
    }),
  }),
  auth,
  updateAvatar,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(new RegExp(regex)),
    }),
  }),
  createUser,
);

module.exports = router;
