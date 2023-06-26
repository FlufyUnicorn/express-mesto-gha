const express = require('express');
const bodyParser = require('body-parser');
const moongose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

const userRoute = require('./routes/userRoutes');
const cardRoute = require('./routes/cardRoutes');

moongose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use('/users', userRoute);
app.use((req, res, next) => {
  req.user = {
    _id: '6495facc994168395ff0ff77',
  };
  next();
});
app.use('/card', cardRoute);

app.listen(PORT, () => {});
