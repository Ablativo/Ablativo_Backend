const config = require('../config.js');

module.exports = function (app) {
    var mentor = require('../controllers/mentor.controller');
 
    app.post('/dashapi/mentor/createMentor', mentor.createMentor);                      //create mentor
    app.get('/mentor/getMentorByName', mentor.getMentorByName);                 //get mentor details

};