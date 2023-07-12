const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ConflictError = require('../utils/errors/ConflictError');
const User = require('../models/user');
const { JWT_SECRET, SUCCESS_CREATED_CODE } = require('../utils/constants');
const BadRequestError = require('../utils/errors/BadRequestError');

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.checkUser(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
        name, about, avatar, email, password: hash,
      },
    )
      .then((user) => {
        res.status(SUCCESS_CREATED_CODE).send({
          name: user.name, about: user.about, avatar: user.avatar, email: user.email,
        });
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError('Пользователь с данным email уже зарегистрирован'));
        } else if (err.name === 'CastError' || err.name === 'ValidationError') {
          next(new BadRequestError('Переданы не валидные данные'));
        } else {
          next(err);
        }
      }));
};

module.exports = {
  login,
  createUser,
};
