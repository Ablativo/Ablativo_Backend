const User = require("../models/user.model.aws");
const Visit = require("../models/visit.model.aws");
const Artwork = require("../models/artwork.model.aws");
const ChatMessage = require("../models/chatMessage.model.aws");
const ChatList = require("../models/chatList.model.aws");

var config = require("../config.js");

const path = require("path");
const { v4: uuidv4 } = require("uuid");

exports.getChatList = async (req, res) => {
  try {
    console.log(req.decoded._id + " DEBUG START: getChatList");
    var userID = req.decoded._id;

    await ChatList.query("_userID")
      .eq(userID)
      .exec((err, chat) => {
        if (!err) {
          console.log(
            req.decoded._id +
              " INFO PARAM OUT: createChat : " +
              JSON.stringify(chat, undefined, 4)
          );
          res.send({ success: true, status: 200, data: chat });
        } else {
          console.error(
            req.decoded._id + " ERROR: createChat : chat error > " + err
          );
        }
      });
  } catch (e) {
    console.error(req.decoded._id + " CATCH: getChatList : chat error > " + e);
    return res.send({ status: 500, success: false, message: e.message });
  }
};

exports.createChat = (req, res) => {
  try {
    console.log(req.decoded._id + " DEBUG START: createChat");
    var userID = req.decoded._id;
    var artworkID = req.body.artworkID;
    var artworkAvatar = req.body.artworkAvatar;
    var artworkName = req.body.artworkName;

    var chatID = userID + "_" + artworkID;

    var message = new ChatMessage({
      id: uuidv4(),
      user: {
        id: artworkID,
        name: artworkName,
        avatar: artworkAvatar,
      },
      text: req.body.message,
      createdAt: Date.now().toString(),
    });

    console.log(message);
    message.save((err, messageSaved) => {
      if (!err) {
        console.log(
          req.decoded._id +
            " INFO PARAM OUT: createChat : " +
            JSON.stringify(messageSaved, undefined, 4)
        );

        var chat = new ChatList({
          _id: chatID,
          _userID: userID,
          artworkName: artworkName,
          artworkAvatar: artworkAvatar,
          date: req.body.date,
          messages: [messageSaved],
        });

        chat.save((err, chatSaved) => {
          if (!err) {
            console.log(
              req.decoded._id +
                " INFO PARAM OUT: createChat : " +
                JSON.stringify(chatSaved, undefined, 4)
            );
            res.send({ success: true, status: 200, data: chatSaved });
          } else {
            console.error(
              req.decoded._id + " ERROR: createChat : chat error > " + err
            );
            res.send({ success: false, status: 500, message: err });
          }
        });
      } else {
        console.error(
          req.decoded._id + " ERROR: createChat : message error > " + err
        );
        res.send({ success: false, status: 500, message: err });
      }
    });

    console.log(req.decoded._id + " DEBUG END: createChat");
  } catch (e) {
    console.error(req.decoded._id + " CATCH: createChat : chat error > " + e);
    return res.send({ status: 500, success: false, message: e.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    console.log(req.decoded._id + " DEBUG START: sendMessage");
    var userID = req.decoded._id;
    var artworkID = req.body.artworkID;
    var artworkAvatar = req.body.artworkAvatar;
    var artworkName = req.body.artworkName;
    var chatID = userID + "_" + artworkID;

    var message = new ChatMessage({
      id: uuidv4(),
      user: {
        id: artworkID,
        name: artworkName,
        avatar: artworkAvatar,
      },
      text: req.body.message,
      createdAt: Date.now().toString(),
    });

    var chat = await ChatList.get(chatID);

    var lastMessages = [];
    
    chat.messages.filter((item) => lastMessages.push(item.id));
    
    var messages =
      lastMessages == undefined ? [message.id] : [...lastMessages, message.id];

    await message.save((err, messageSaved) => {
      if (!err) {
        console.log(
          req.decoded._id +
            " INFO PARAM OUT: sendMessage : " +
            JSON.stringify(messageSaved, undefined, 4)
        );

        ChatList.update(
          {
            _id: chatID,
            messages: messages,
          },
          (error, chatSaved) => {
            if (error) {
              console.error(
                req.decoded._id +
                  " ERROR: sendMessage on update chatList error > " +
                  error
              );
              res.send({ success: false, status: 500, message: err });
            } else {
              console.log(
                req.decoded._id +
                  " INFO PARAM OUT: sendMessage : " +
                  JSON.stringify(chatSaved, undefined, 4)
              );
              res.send({ success: true, status: 200, data: chatSaved });
            }
          }
        );
      } else {
        console.error(
          req.decoded._id + " ERROR: sendMessage : message error > " + err
        );
        res.send({ success: false, status: 500, message: err });
      }
    });

    console.log(req.decoded._id + " DEBUG END: sendMessage");
  } catch (e) {
    console.error(req.decoded._id + " CATCH: sendMessage : chat error > " + e);
    return res.send({ status: 500, success: false, message: e.message });
  }
};
