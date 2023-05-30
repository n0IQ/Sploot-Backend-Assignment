const express = require('express');
const articleController = require('../controllers/articleController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/', articleController.getArticles);

router.post('/:userId/articles', articleController.createArticle);

module.exports = router;
