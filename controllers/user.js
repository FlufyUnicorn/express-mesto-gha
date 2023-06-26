const User = require('../models/user')
const BadRequestError = require("./utils/BadRequestError")

const createUser = (req, res, next) => {
  const {name, about, avatar} = req.body
  User.create({name, about, avatar})
    .then(() => {
      res.send({message: 'Пользователь успешно создан'})
    })
    .catch(err => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы невалидные данные'))
      }
      else {
        next(err)
      }
    })
}

const getUser = (req, res, next) => {
  const {userId} = req.params
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: 'Пользователь не найден'
        })
      }
      res.send(user)
    })
    .catch(err => {
      if (err.name ==='CastError') {
        next(new BadRequestError('Переданы невалидные данные'))
      }
      else {
        next(err)
      }
    })
}

const getAllUsers = (req, res, next) => {
  User.find({})
    .then(user => {
      res.send(user)
    })
    .catch(err => {
      next(err)
    })
}

const updateProfile = (req, res, next) => {
  const {name, about} = req.body
  User.findByIdAndUpdate(req.user._id, {name, about})
    .then(user => {
        res.send(user)
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message))
      }
      else {
        next(err)
      }
    })
}

const updateAvatar = (req, res, next) => {
  const {avatar} = req.body
  User.findByIdAndUpdate(req.user._id, {avatar})
    .then(user => {
      res.send(user)
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message))
      }
      else {
        next(err)
      }
    })
}

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateAvatar,
  updateProfile
}