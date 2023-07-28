const express = require('express');
// const path = require("path");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');

const { PORT = 3000 } = process.env;

const NOT_FOUND_CODE = 404;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64be8b077e3cdc52c8ae4167',
  };

  next();
});

app.use('/', routesUsers);

// app.get("/", (req, res) => {
//   res.send(`Приложение запущено на порту ${PORT}`);
// });

app.use('/', routesCards);

app.patch('*', (req, res) => {
  res.status(NOT_FOUND_CODE).send({
    message: 'Несуществующий адрес сайта',
  });
});

app.listen(PORT, () => {
  console.log(`Приложение запущено на порту ${PORT}`);
});
