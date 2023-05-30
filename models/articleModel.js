const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter the title'],
  },
  description: {
    type: String,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please provide the author of this article'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

articleSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: 'name age email',
  });

  next();
});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
