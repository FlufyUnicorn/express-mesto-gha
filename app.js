const express = require('express');
const bodyParser = require('body-parser');
const moongose = require('mongoose');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/user');

const { PORT = 3000 } = process.env;
const app = express();

const userRoute = require('./routes/userRoutes');
const cardRoute = require('./routes/cardRoutes');
const invalidRoutes = require('./routes/invalidURLs');

moongose.connect('mongodb://localhost:27017/mestodb');
app.post('/signin', login);
app.post('/signup', createUser);
app.use(bodyParser.json());
app.use(auth);
app.use('/users', userRoute);
app.use('/cards', cardRoute);

app.use('*', invalidRoutes);

app.listen(PORT, () => {
  console.log('server start');
});
