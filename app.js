const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const mongoose = require('./database');
const bodyParser = require('body-parser');
const session = require('express-session');
const { requireLogin } = require('./middleware');

const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening in port ${port}`);
});

app.set('view engine', 'pug');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: 'bbq chips',
    resave: true,
    saveUninitialized: false
  })
);

// Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');

app.use('/login', loginRoute);
app.use('/register', registerRoute);

app.get('/', requireLogin, (req, res, next) => {
  let payload = {
    userLoggedIn: req.session.user
  };
  res.status(200).render('home', payload);
});
