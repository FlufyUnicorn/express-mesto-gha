const userRoute = require('express').Router();
const {
  getUser, getAllUsers, updateProfile, updateAvatar, getMe,
} = require('../controllers/user');
const { validateUserId, validateUserInfo, validateAvatar } = require('../utils/validators/userValidator');

userRoute.get('/', getAllUsers);
userRoute.get('/me', getMe);
userRoute.get('/:id', validateUserId, getUser);

userRoute.patch('/me', validateUserInfo, updateProfile);
userRoute.patch('/me/avatar', validateAvatar, updateAvatar);

module.exports = userRoute;
