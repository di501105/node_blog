const express = require('express');
const router = express.Router();
const striptags = require('striptags');
const monent = require('moment');
const pagination = require('../modules/pagination');
const firebaseAdminDb = require('../connections/firebase_admin');

const categoriesRef = firebaseAdminDb.ref('/categories/');
const articlesRef = firebaseAdminDb.ref('/articles');


/* GET home page. */
router.get('/', function (req, res, next) {
  let currentPage = Number.parseInt(req.query.page) || 1;
  let categories = {};
  categoriesRef.once('value').then((snapshot) => {
    categories = snapshot.val();
    return articlesRef.orderByChild('update_time').once('value');
  }).then((snapshot) => {
    const articles = [];
    snapshot.forEach((snapshotChild) => {
      // console.log(snapshotChild.val());
      if ('public' === snapshotChild.val().status) {
        articles.push(snapshotChild.val());
      }
    });
    articles.reverse();
    const data = pagination(articles, currentPage);
    // console.log(data);

    res.render('index', {
      title: 'Express',
      articles: data.data,
      page: data.page,
      categories,
      striptags,
      monent,
    });
  });
});

router.get('/post/:id', function (req, res, next) {
  const id = req.param('id');
  console.log(id);
  let categories = {};
  categoriesRef.once('value').then((snapshot) => {
    categories = snapshot.val();
    return articlesRef.child(id).once('value');
  }).then((snapshot) => {
    const article = snapshot.val();
    console.log(article);
    res.render('post', {
      title: 'Express',
      categories,
      article,
      monent
    });
  });
});

router.get('/dashboard/signup', function (req, res, next) {
  res.render('dashboard/signup', { title: 'Express' });
});

module.exports = router;
