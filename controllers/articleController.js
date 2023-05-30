const Article = require('../models/articleModel');
const catchAsync = require('../utils/catchAsync');

exports.getArticles = catchAsync(async (req, res, next) => {
  const articles = await Article.find();

  res.status(200).json({
    statusCode: 200,
    message: 'success',
    data: {
      data: articles,
    },
  });
});

exports.createArticle = catchAsync(async (req, res, next) => {
  const newArticle = await Article.create({
    title: req.body.title,
    description: req.body.description,
    author: req.user.id,
  });

  res.status(201).json({
    statusCode: 201,
    message: 'Article has been created successfully',
    data: {
      data: newArticle,
    },
  });
});
