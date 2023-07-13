const express = require('express');
const bodyParser = require('body-parser');
const moongose = require('mongoose');
const { errors } = require('celebrate');
const userRoute = require('./routes/userRoutes');
const cardRoute = require('./routes/cardRoutes');
const invalidRoutes = require('./routes/invalidURLs');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/auth');
const { validateLogin, validateRegister } = require('./utils/validators/userValidator');
const errorsHandler = require('./middlewares/errorHandler');

const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();
app.use(bodyParser.json());
moongose.connect(DB_URL);

app.post('/signin', validateLogin, login);
app.post('/signup', validateRegister, createUser);

app.use(auth);
app.use('/users', userRoute);
app.use('/cards', cardRoute);

app.use('*', invalidRoutes);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log('server start');
});
