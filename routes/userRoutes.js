const userRoute = require('express').Router();
const {
  createUser, getUser, getAllUsers, updateProfile, updateAvatar,
} = require('../controllers/user');

userRoute.post('/', createUser);
userRoute.get('/:userId', getUser);
userRoute.get('/', getAllUsers);
userRoute.patch('/me', updateProfile);
userRoute.patch('/me/avatar', updateAvatar);

module.exports = userRoute;
