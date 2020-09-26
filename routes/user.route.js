const passport = require('passport');
const User = require("../models/user.model.aws");
const config = require('../config.js');

module.exports = function (app) {
    var user = require('../controllers/user.controller');
    var auth = require('../controllers/auth/auth.controller.js');
    var validator = require('../validations/user.validation'); 
 
    app.post('/user/authenticate', auth.authenticate);                 //authenticate user
    app.post('/user/register', validator.validateUser, auth.register); //register user
    app.post('/user/checkUsername', auth.checkUsername); //check if username is available
    app.get('/api/user', user.getMyInfo);                               //get own user info
    
    //app.post('/api/users/logoutUser', user.logoutUser);                 //logout user

   
};