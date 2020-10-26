const config = require('../config.js');

module.exports = function (app) {
    var day = require('../controllers/day.controller');

    app.post('/api/day/createDay', day.createDay);               //create day, made by the user => api route
    app.get('/dashapi/day/getWeek', day.getWeek);                    //get week info

};
