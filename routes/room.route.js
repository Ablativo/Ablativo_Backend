const config = require('../config.js');


module.exports = function (app) {
    var room = require('../controllers/room.controller');
 
    // rooms apis are used only by the dashboard which does not use the local auth 
    // and therefore needs a different path 
    app.get('/dashapi/room/getRoomList', room.getRoomList);                // get room list                                                       
    app.get('/dashapi/room/getRoomByID', room.getRoomByID);                // get room by id

    app.post('/dashapi/room/createRoom', room.createRoom);                 //create room
    app.post('/dashapi/room/createArtwork', room.createArtwork);           //create artwork
    app.post('/api/room/upvoteArtwork', room.upvoteArtwork);               //upvote artwork
    app.post('/api/room/upvoteRoom', room.upvoteRoom)                      //upvote room
};