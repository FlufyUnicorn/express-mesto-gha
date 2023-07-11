const NotFoundError = require('../utils/errors/NotFoundError');

function getInvalidURL() {
  throw new NotFoundError('Запрашиваемый адрес не найден. Проверьте URL и метод запроса');
}

module.exports = { getInvalidURL };
