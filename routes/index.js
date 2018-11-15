const createError = require('http-errors');
const express = require('express');
const router = express.Router();
const striptags = require('striptags');
const monent = require('moment');
const pagination = require('../modules/pagination');
const firebaseAdminDb = require('../connections/firebase_admin');
const firebaseSort = require('../modules/firebaseSort');

const categoriesRef = firebaseAdminDb.ref('/categories/');
const articlesRef = firebaseAdminDb.ref('/articles/');



/* GET home page. */
router.get('/', function (req, res, next) {
  let currentPage = Number.parseInt(req.query.page) || 1;
  let categories = {};
  categoriesRef.once('value').then((snapshot) => {
    categories = snapshot.val();
    console.log(categories);
    return articlesRef.orderByChild('update_time').once('value');
  }).then((snapshot) => {
    const sortData = firebaseSort.byData(snapshot, 'status', 'public');
    const data = pagination(sortData, currentPage);
  
    // console.log(data);
    res.render('archives', {
      title: 'Express',
      articles: data.data,
      page: data.page,
      categoryId: '',
      categories,
      striptags,
      monent,
    });
  });  
});

router.get('/archives/:category', function (req, res, next) {
  const currentPage = Number.parseInt(req.query.page) || 1;
  const categoryPath = req.param('category');
  let categories = {};
  let categoryId = '';
  categoriesRef.once('value').then((snapshot) => {
    categories = snapshot.val();
    snapshot.forEach((snapshotChild) => {
      // console.log(snapshotChild.val());
      if (categoryPath === snapshotChild.val().path) {
        categoryId = snapshotChild.val().id;
      }
    });
    return articlesRef.orderByChild('update_time').once('value');
  }).then((snapshot) => {
    const sortData = firebaseSort.byData(snapshot, 'category', categoryId);
    const data = pagination(sortData, currentPage, `archives/${categoryPath}`);

    res.render('archives', {
      title: 'Express',
      articles: data.data,
      page: data.page,
      categories,
      categoryId,
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
    if (!article) {
      // return res.render('error', {
      //   message: '找不到該文章'
      // });
      return next(createError(404, '找不到該文章:('));
    }
    res.render('post', {
      title: 'Express',
      categories,
      categoryId: '',
      article,
      monent
    });
  });
});

router.get('/dashboard/signup', function (req, res, next) {
  res.render('dashboard/signup', { title: 'Express' });
});

module.exports = router;
