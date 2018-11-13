const express = require('express');
const firebaseClient = require('../connections/firebase_client');

const router = express.Router();

router.get('/signup', (req, res) => {
  const messages = req.flash('error');
  res.render('dashboard/signup', {
    messages,
    hasErrors: messages.length > 0,
  });
});

router.get('/signin', (req, res) => {
  const messages = req.flash('error');
  res.render('dashboard/signin', {
    messages,
    hasErrors: messages.length > 0,
  });
});

router.get('/signout', (req, res) => {
  req.session.uid = '';
  res.redirect('/auth/signin');
});

router.post('/signup', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirm_password;
  if (password !== confirmPassword) {
    req.flash('error', '兩個密碼不一致');
    res.redirect('/auth/signup');
  }

  firebaseClient.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
    console.log(req.session.uid);
    res.redirect('/auth/signin');
  })
  .catch((error) => {
    console.log(error);
    req.flash('error', error.message);
    res.redirect('/auth/signup');
  });
});

router.post('/signin', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  firebaseClient.auth().signInWithEmailAndPassword(email, password)
    .then(function(user) {
      req.session.uid = user.uid;
      req.session.email = req.body.email;
      console.log('session', req.session);
      res.redirect('/dashboard');
    })
    .catch((error) => {
      console.log(error);
      req.flash('error', error.message);
      res.redirect('/auth/signin');
    });
});


module.exports = router;