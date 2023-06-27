const User = require('../models/user');
const {
  NOT_FOUND_ERROR_CODE, DEFAULT_ERROR_CODE, INCORRECT_DATA_ERROR_CODE, SUCCESS_CREATED_CODE,
} = require('../utils/constants');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(SUCCESS_CREATED_CODE).send({
        name: user.name, about: user.about, _id: user._id, avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы невалидные данные' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка' });
      }
    });
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
    .catch((err) => {
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

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateAvatar,
  updateProfile,
};
