function getInvalidURL(req, res, next) {
  res.status(404).send({ message: "Такой страницы не существует" })
}

module.exports = { getInvalidURL };
