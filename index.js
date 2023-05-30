const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
const articleRouter = require('./routes/articleRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

dotenv.config({ path: './config.env' });

const app = express();

// Connect Database
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database Connected Successfully!');
  })
  .catch((err) => {
    console.log('Database Error', err);
  });

// Middlewares
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.get('/', (req, res) => {
  res.send('Server is up and fine!');
});

app.use('/api', userRouter);
app.use('/api/users', articleRouter);
app.use('/api/articles', articleRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

// Start Server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
