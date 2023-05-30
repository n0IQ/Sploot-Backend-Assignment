const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { createSendToken } = require('./authController');

const filter = (obj, ...allowedFields) => {
  //   console.log(obj);
  //   console.log(allowedFields);

  const filteredObj = {};

  Object.keys(obj).forEach((option) => {
    if (allowedFields.includes(option)) {
      filteredObj[option] = obj[option];
    }
  });

  return filteredObj;
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = createSendToken(newUser._id, res);
  newUser.password = undefined;

  res.status(201).json({
    statusCode: 201,
    token,
    message: 'Signup successful',
    data: {
      data: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please enter email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = createSendToken(user._id, res);
  user.password = undefined;

  res.status(200).json({
    statusCode: 200,
    token,
    message: 'user logged in successfully',
    data: {
      data: user,
    },
  });
});

exports.update = catchAsync(async (req, res, next) => {
  // Filtering to allow update only of name and age fields
  let filteredObj = filter(req.body, 'name', 'age');
  //   console.log(filteredObj);

  const user = await User.findByIdAndUpdate(req.params.userId, filteredObj, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('No user found with this ID', 400));
  }

  res.status(200).json({
    statusCode: 200,
    message: 'User updated successfully',
    data: {
      data: user,
    },
  });
});
