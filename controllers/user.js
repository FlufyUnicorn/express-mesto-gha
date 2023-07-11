const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  NOT_FOUND_ERROR_CODE, SUCCESS_CREATED_CODE,
} = require('../utils/constants');
const BadRequestError = require('../utils/errors/BadRequestError');
const ConflictError = require('../utils/errors/ConflictError');

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

const getUser = (req, res, next) => {
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
        next(new BadRequestError('Переданы не валидные данные'));
      } else {
        next(err);
      }
    });
};

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.checkUser(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

const getMe = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => next(err));
};

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateAvatar,
  updateProfile,
  login,
  getMe,
};
