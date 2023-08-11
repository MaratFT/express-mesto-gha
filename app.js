const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const helmet = require('helmet');
const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');

const auth = require('./middlewares/auth');

// const BadRequestError = require("./errors/bad-request-error");
// const ExistsDatabaseError = require("./errors/exists-database-error");
// const NotFoundError = require("./errors/not-found-err");
// const ServerError = require("./errors/server-error");
// const UnauthorizedError = require("./errors/unauthorized-error");

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const NOT_FOUND_CODE = 404;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();

app.use(helmet());

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routesUsers);

app.patch('*', (req, res) => {
  res.status(NOT_FOUND_CODE).send({
    message: 'Несуществующий адрес сайта',
  });
});

// app.use(auth);

app.use('/', auth, routesCards);

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  // if (err) {
  //   res.status(401).send({ message: "Необходима авторизация" });
  //   return;
  // }

  if (err.kind === 'ObjectId') {
    res.status(400).send({
      message: 'Некорректный запрос',
    });
    return;
  }
  if (err.name === 'ValidationError') {
    res.status(400).send({
      message: 'Переданы некорректные данные',
    });
    return;
  }
  if (err.code === 11000) {
    res.status(409).send({
      message: 'Уже существует такой пользователь',
    });
    return;
  }
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });

  next();
});

app.listen(PORT, () => {
  console.log(`Приложение запущено на порту ${PORT}`);
});
