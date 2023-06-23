const cardRoute = require('express').Router()
const {createCard, deleteCard, getAllCards, likeCard, dislikeCard} = require("../controllers/card")

cardRoute.post('/cards', createCard)
cardRoute.delete('/cards/:cardId', deleteCard)
cardRoute.get('/cards', getAllCards)
cardRoute.put('/cards/:cardId/likes', likeCard)
cardRoute.delete('/cards/:cardId/likes', dislikeCard)

module.exports = cardRoute