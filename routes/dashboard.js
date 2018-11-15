const express = require('express');
const router = express.Router();
const striptags = require('striptags');
const monent = require('moment');
const firebaseAdminDb = require('../connections/firebase_admin');
const pagination = require('../modules/pagination');
const firebaseSort = require('../modules/firebaseSort');

const categoriesRef = firebaseAdminDb.ref('/categories/');
const articlesRef = firebaseAdminDb.ref('/articles/');

router.get('/', (req, res) => {
  const messages = req.flash('error');
  res.render('dashboard/index', {
    title: 'Express',
    currentPath: '/',
    hasInfo: messages.length > 0,
  });
});

router.get('/archives', function (req, res, next) {
  const messages = req.flash('error');
  const status = req.query.status || 'public';
  const currentPage = Number.parseInt(req.query.page) || 1;
  // console.log(status);
  let categories = {};
  categoriesRef.once('value').then((snapshot) => {
    categories = snapshot.val();
    return articlesRef.orderByChild('update_time').once('value');
  }).then((snapshot) => {
    // const articles = [];
    // snapshot.forEach((snapshotChild) => {
    //   // console.log(snapshotChild.val());
    //   if (status === snapshotChild.val().status) {
    //     articles.push(snapshotChild.val());
    //   }
    // });
    // articles.reverse();

    const sortData = firebaseSort.byData(snapshot, 'status', status);
    const data = pagination(sortData, currentPage, `/dashboard/archives`);

    res.render('dashboard/archives', {
      title: 'Express',
      articles: data.data,
      page: data.page,
      messages,
      categories,
      striptags,
      monent,
      status,
      hasInfo: messages.length > 0
    });
  });
});

router.get('/article/create', function (req, res, next) {
  categoriesRef.once('value').then((snapshot) => {
    const categories = snapshot.val();
    // console.log('categories', categories);
    res.render('dashboard/article', {
      title: 'Express',
      categories
    });
  });
});

router.get('/article/:id', function (req, res, next) {
  const id = req.param('id');
  console.log(id);
  let categories = {};
  categoriesRef.once('value').then((snapshot) => {
    categories = snapshot.val();
    return articlesRef.child(id).once('value');
  }).then((snapshot) => {
    const article = snapshot.val();
    console.log(article);
    res.render('dashboard/article', {
      title: 'Express',
      categories,
      article
    });
  });
});

router.get('/categories', function (req, res, next) {
  const messages = req.flash('info');
  categoriesRef.once('value', (snapshot) => {
    const categories = snapshot.val();
    console.log(categories);
    res.render('dashboard/categories', { 
      title: 'Express',
      messages,
      hasInfo: messages.length > 0,
      categories
    });
  });
});



router.post('/article/create', (req, res) => {
  // console.log(req.body);
  const data = req.body;
  const articleRef = articlesRef.push();
  const key = articleRef.key;
  const updateTime = Math.floor(Date.now() / 1000);
  data.id = key;
  data.update_time = updateTime;
  // console.log(data);
  articleRef.set(data).then(() => {
    res.redirect(`/dashboard/article/${key}`);
  });
});

router.post('/article/update/:id', (req, res) => {
  const data = req.body;
  const id = req.param('id');
  console.log(data);
  articlesRef.child(id).update(data).then(() => {
    res.redirect(`/dashboard/article/${id}`);
  });
});

router.post('/article/delete/:id', (req, res) => {
  const id = req.param('id');
  articlesRef.child(id).remove();
  req.flash('info', '文章已刪除');
  res.send('文章已刪除');
  res.end();
});

router.post('/categories/create', (req, res) => {
  const data = req.body;
  console.log(data);
  const categoryRef = categoriesRef.push();
  const key = categoryRef.key;
  data.id = key;
  categoriesRef.orderByChild('path').equalTo(data.path).once('value').then((snapshot) => {
    if (snapshot.val() !== null) {
      req.flash('info', '已有相同路徑');
      res.redirect('/dashboard/categories');
    } else {
      categoryRef.set(data).then(() => {
        res.redirect('/dashboard/categories');
      });
    }
  });
});

router.post('/categories/delete/:id', (req, res) => {
  const id = req.param('id');
  categoriesRef.child(id).remove();
  req.flash('info', '欄位已刪除');
  res.redirect('/dashboard/categories');
});

module.exports = router;