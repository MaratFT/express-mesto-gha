const jwt = require('jsonwebtoken');

// const UNAUTHORIZED_ERROR_CODE = 401;
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      '6abdf5e2d4054227bc988ee37bad3c4f8c4ee34e83dfeda9b6b228888605fa90',
    );
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  // res.append("Authorization", `Bearer ${token}`);
  next(); // пропускаем запрос дальше
};

// throw new UnauthorizedError("Необходима авторизация");
