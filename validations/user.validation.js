'use strict';

const validator = require('validator');
const User = require("../models/user.model.aws");

exports.validateUser = (req, res, next) => {
  if (!req.body.pwd) {
    res.send({ success: false, status: 400, message: 'PWD_REQUIRED' });
  } else if (!validator.matches(req.body.pwd, '^[a-zA-Z0-9_]*$')) {    // only letters/numbers/underscore
    res.send({ success: false, status: 400, message: 'INVALID_PWD' });
  } else {
    next();
  }
};

 exports.validateUsername = (req, res, next) => {
  const username = (!!req.body.username) ? validator.trim(req.body.username) : '';
  if (!username)
    res.send({ success: false, status: 500, message: 'USERNAME_REQUIRED' });
  else
    next();
};

 
