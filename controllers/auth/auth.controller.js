'use strict';
const path = require('path');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const validator = require('validator');
const randomstring = require('randomstring');
const config = require('../../config.js');
const User = require('../../models/user.model');
const self = require('../auth/auth.controller');
const bcrypt = require('bcrypt');



exports.authenticate = (req, res) => {
  try {
    console.log('DEBUG START: authenticate ' + req.body.username);
    console.log('INFO PARAM IN: authenticate : ' + req.body.username);
    passport.authenticate('local', { session: true }, (err, user, info) => {
      if (!err) {
        if (!user) {
          console.log('INFO PARAM OUT: authenticate : user does not exists ' + req.body.username);
          res.json(info);
        }
        else {
          var userJson = { _id: user._id };
          var token = jwt.sign(userJson, require('../../secret'), { expiresIn: 15552000 }); // 6 months
          req.login(user, function (err) {
            if (err) {
              console.log('INFO PARAM OUT: authenticate : Login error ' + req.body.username + " " + JSON.stringify(err));
              return res.status(401).json(err);
            } else {
              console.log('INFO PARAM OUT: authenticate : Logged successfully ' + req.body.username);
              res.send({ success: true, status: 200, token: token });
            }
          });
        }
      }
      else {
        console.error('ERROR: authenticate : ' + JSON.stringify(err) + ' ' + req.body.username);
      }

    })(req, res);

    console.log('DEBUG END: authenticate' + req.body.username);
  }
  catch (e) {
    console.error('CATCH: authenticate : ' + e + ' ' + req.body.username);
    return res.status(401).json(e.message);
  }

};

exports.register = async (req, res) => {
  try {
    console.log(req.body.username + ' DEBUG START: register ');
    console.log(req.body.username + ' INFO PARAM IN:  register : ' + JSON.stringify(req.body.username));
    var username = req.body.username;
    var saltRounds = 10;

    User.findOne({ username: username }).then((user) => {
      if (user == undefined) {
        const pwd = bcrypt.hashSync(req.body.pwd, saltRounds);

        var user = new User({
          username: username,
          password: pwd,
        });
        //user.email = req.body.email;
        
        user.provider = 'local';


        user.save((err, userSaved) => {
          if (!err) {
            user.password = undefined;
            var expire = 15552000; //6 mesi, config.mailer.registerUser.expire;

            var userJson = { _id: userSaved._id };

            jwt.sign(userJson, require('../../secret'), { expiresIn: expire }, (error, token) => {
              if (!error) {
                console.log(req.body.username + ' INFO PARAM OUT:  register : Sign in completed!');
                res.send({ success: true, status: 200, message: 'Sign in completed!',  token: token });
              }
              else {
                delete error.op.password;
                console.log(req.body.username + ' INFO PARAM OUT:  register : ' + JSON.stringify(error));
                res.send({ success: false, status: 500, message: error });
              }
            });


          }
          else {
            console.error('ERROR: register : ' + JSON.stringify(err));
            res.send({ success: false, status: 500, message: err });
          }
        });
      }
      else {
        console.log(req.body.username + ' INFO PARAM OUT: register : Username taken!');
        res.send({ success: false, status: 400, message: 'Sorry, your username is taken!' });
      }
    });
    console.log(req.body.username + ' DEBUG END: register ');


  }
  catch (e) {
    console.error('CATCH: register : ' + e);
    return res.send({ success: false, status: 500, message: e.message });
  }

};