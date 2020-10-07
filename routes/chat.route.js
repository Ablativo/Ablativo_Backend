const User = require("../models/user.model.aws");
const config = require('../config.js');

module.exports = function (app) {
    var chat = require('../controllers/chat.controller');
 
    app.post('/api/chat/createChat', chat.createChat);                     //create chat
                                                                      
    app.get('/api/chat/getChatList', chat.getChatList);                     //create chat

};