const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../schemas/UserSchema');
const router = express.Router();

app.set('view engine', 'pug');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res, next) => {
  let payload = {
    pageTitle: 'Login'
  };
  res.status(200).render('login', payload);
});

router.post('/', async (req, res) => {
  const payload = req.body;

  if (req.body.logUsername && req.body.logPassword) {
    const user = await User.findOne({
      $or: [{ username: req.body.logUsername }, { email: req.body.logPassword }]
    }).catch((err) => {
      console.log(err);
      payload.errorMessage = 'Something went wrong.';
      res.status(500).render('login', payload);
    });

    if (user) {
      const result = await bcrypt.compare(req.body.logPassword, user.password);

      if (result === true) {
        req.session.user = user;
        return res.redirect('/');
      }
    }
    payload.errorMessage = 'Login credentials incorrect!';
    return res.status(400).render('login', payload);
  }

  payload.errorMessage = 'Make sure each field has a valid value';
  res.status(200).render('login');
});

module.exports = router;
