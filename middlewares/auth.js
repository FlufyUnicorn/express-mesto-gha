const jwt = require('jsonwebtoken');
const NotFoundError = require('../utils/errors/NotFoundError');
const { JWT_SECRET } = require('../utils/constants');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  console.log('проверяю авторизацию');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.log(req.headers);
    return next(new NotFoundError('Необходима авторизация'));
  }
  console.log('check token');
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new NotFoundError('Необходима авторизация'));
  }
  console.log('checked token');
  req.user = payload;
  console.log('current user', req.user);
  next();
};
