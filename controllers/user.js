const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  NOT_FOUND_ERROR_CODE, DEFAULT_ERROR_CODE, INCORRECT_DATA_ERROR_CODE, SUCCESS_CREATED_CODE,
} = require('../utils/constants');

const createUser = (req, res) => {
  console.log(req.body);
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
        name, about, avatar, email, password: hash,
      },
    )
      .then(() => {
        res.status(SUCCESS_CREATED_CODE).send({ message: 'Пользователь успешно создан' });
      })
      .catch((err) => {
        if (err.name === 'CastError' || err.name === 'ValidationError') {
          res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы невалидные данные' });
        } else {
          res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка' });
        }
      }));
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь не найден' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы невалидные данные' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка' });
      }
    });
};

const getAllUsers = (req, res) => {
  User.find({})
    .then((user) => {
      res.send(user);
    })
    .catch(() => {
      res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка' });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы невалидные данные' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы невалидные данные' });
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.checkUser(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateAvatar,
  updateProfile,
  login,
};
