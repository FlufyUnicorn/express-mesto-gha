const User = require('../models/user');
const BadRequestError = require('../utils/BadRequestError');

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send({ message: 'Пользователь успешно создан', name: user.name, about: user.about, _id:user._id, avatar: user.avatar});
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы невалидные данные' })
      } else {
        next(err);
      }
    });
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Переданы невалидные данные' })
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
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).json({message: 'Переданы невалидные данные'});
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).json({message: 'Переданы невалидные данные'});
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateAvatar,
  updateProfile,
};
