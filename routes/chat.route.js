const User = require("../models/user.model.aws");
const config = require('../config.js');

module.exports = function (app) {
    var chat = require('../controllers/chat.controller');
 
    app.post('/api/chat/createChat', chat.createChat);                      //create chat
    app.post('/api/chat/sendMessage', chat.sendMessage);                    //send message             
    app.get('/api/chat/getChatList', chat.getChatList);                     //create chat

};