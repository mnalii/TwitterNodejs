const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../schemas/UserSchema');

app.set('view engine', 'pug');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res, next) => {
  const payload = {
    pageTitle: 'Register'
  };
  res.status(200).render('register', payload);
});

router.post('/', async (req, res, next) => {
  const firstName = req.body.firstName.trim();
  const lastName = req.body.lastName.trim();
  const username = req.body.username.trim();
  const email = req.body.email.trim();
  const password = req.body.password;

  const payload = req.body;
  if (firstName && lastName && username && password) {
    let user = await User.findOne({
      $or: [{ username: username }, { email: email }]
    }).catch((err) => {
      console.log(err);
      payload.errorMessage = 'Something went wrong.';
      res.status(500).render('register', payload);
    });

    if (!user) {
      const data = req.body;
      data.password = await bcrypt.hash(password, 10);

      User.create(data)
        .then((user) => {
          req.session.user = user;
          console.log(req.session);
          return res.redirect('/');
        })
        .catch((err) => console.error(err));
    } else {
      if (email == user.email) {
        payload.errorMessage = 'Email already in use.';
      } else {
        payload.errorMessage = 'Username already in use.';
      }
      res.status(400).render('register', payload);
    }
  } else {
    payload.errorMessage = 'Make sure each field has a valid value.';
    res.status(400).render('register', payload);
  }
});

module.exports = router;
