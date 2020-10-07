const passport = require('passport');
const User = require("../models/user.model.aws");
const config = require('../config.js');

module.exports = function (app) {
    var user = require('../controllers/user.controller');
    var auth = require('../controllers/auth/auth.controller.js');
    var validator = require('../validations/user.validation'); 
 
    app.post('/user/authenticate', auth.authenticate);                 //authenticate user
    app.post('/user/register', validator.validateUser, auth.register); //register user
    app.post('/user/checkUsername', auth.checkUsername);               //check if username is available
    app.post('/api/user/createVisit', user.createVisit);               //create visit
    app.post('/api/user/createArtwork', user.createArtwork);           //create artwork
    app.post('/api/user/createRoom', user.createRoom);                 //create room
    

    app.get('/api/user/getMyInfo', user.getMyInfo);                    //get own user info
    app.get('/api/user/getMyVisits', user.getMyVisits);                 //get own user visits
    app.get('/api/user/getRoomByID', user.getRoomByID);                //get own room info
    app.get('/api/user/getArtworkByID', user.getArtworkByID);          //get own artwork info

    

    //app.post('/api/users/logoutUser', user.logoutUser);              //logout user
                                                                      
   
};