const User = require("../models/user.model.aws");
const Visit = require("../models/visit.model.aws");
const Artwork = require("../models/artwork.model.aws");
const Room = require("../models/room.model.aws");

const ChatMessage = require("../models/chatMessage.model.aws");
const ChatList = require("../models/chatList.model.aws");

var config = require("../config.js");

const path = require("path");
const { v4: uuidv4 } = require("uuid");

exports.getChatList = async (req, res) => {
  try {
    console.log(
      req.decoded._id + " DEBUG START: getChatList " + req.query.roomID
    );
    var userID = req.decoded._id;

    /*     await ChatList.query("_userID")
      .eq(userID)
      .exec(async (err, chat) => {
        if (!err) {
          console.log(
            req.decoded._id +
              " INFO PARAM OUT: getChatList : " +
              JSON.stringify(chat, undefined, 4)
          ); 
          if (chat.count == 0) {*/
    console.log("DEBUG: getChatList : " + req.query.roomID);
    await Room.get(req.query.roomID, (err, result) => {
      if (!err) {
        console.log(result);
        var chatAvailable = [];
        var chatElement = {};
        result.artworks.map((item, index) => {
          chatElement = {
            chatId: userID + "_" + item._id,
            artworkID: item._id,
            username: item.name,
            message: item.initialMessage
              ? item.initialMessage
              : "Benvenuto al museo di arte classica!",
            avatar: item.image,
            isRead: false,
            date: new Date(),
          };
          chatAvailable.push(chatElement);
        });

        res.send({ success: true, status: 200, data: chatAvailable });
      } else {
        console.error(
          req.decoded._id + " ERROR: createChat : chat error > " + err
        );
        return res.send({ status: 500, success: false, message: err.message });
      }
    });
    /*  } else {
            console.error(
              req.decoded._id + " DEBUG: createChat : chat  > " + chat
            );
            return res.send({
              status: 200,
              success: false,
              message: chat,
            });
          } 
        } else {
          console.error(
            req.decoded._id + " ERROR: createChat : chat error > " + err
          );
          return res.send({ status: 500, success: false, message: e.message });
        }
      });*/
  } catch (e) {
    console.error(req.decoded._id + " CATCH: getChatList : chat error > " + e);
    return res.send({ status: 500, success: false, message: e.message });
  }
};

exports.createChat = async (req, res) => {
  try {
    console.log(
      req.decoded._id +
        " DEBUG START: createChat : " +
        JSON.stringify(req.query, null, 4)
    );
    var userID = req.decoded._id;
    var artworkID = req.query.artworkID;
    var artwork = await Artwork.get(artworkID);

    var artworkAvatar = artwork.image;
    var artworkName = artwork.name;
    var artworkQuestions = artwork.questions;

    var chatID = userID + "_" + artworkID;

    ChatList.get(chatID, (err, result) => {
      if (!err) {
        if (result) {
          console.log(
            req.decoded._id +
              " INFO PARAM OUT: createChat : fetch chat messages : " +
              JSON.stringify(result, undefined, 4)
          );
          var data = {
            ...result,
            artworkAvatar,
            artworkName,
            artworkQuestions,
          };
          res.send({ success: true, status: 200, data: data });
        } else {
          console.log(
            req.decoded._id +
              " INFO PARAM OUT: createChat : no such document create a new one : "
          );
          
          var message = new ChatMessage({
            _id: uuidv4(),
            user: {
              _id: artworkID,
              name: artworkName,
              avatar: artworkAvatar,
            },
            text: artwork.initialMessage,
            createdAt: new Date(),
          });

          message.save((err, messageSaved) => {
            if (!err) {
              console.log(
                req.decoded._id +
                  " INFO PARAM OUT: createChat : create a new chat : " +
                  JSON.stringify(messageSaved, undefined, 4)
              );

              var chat = new ChatList({
                _id: chatID,
                _userID: userID,
                artworkName: artworkName,
                artworkAvatar: artworkAvatar,
                date: new Date(),
                messages: [messageSaved],
              });

              chat.save((err, chatSaved) => {
                if (!err) {
                  console.log(
                    req.decoded._id +
                      " INFO PARAM OUT: createChat : " +
                      JSON.stringify(chatSaved, undefined, 4)
                  );
                  var data = {
                    ...chatSaved,
                    artworkAvatar,
                    artworkName,
                    artworkQuestions,
                  };
                  res.send({ success: true, status: 200, data: data });
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
        }
      } else {
        console.error(
          req.decoded._id + " CATCH: createChat : chat error > " + err
        );
        return res.send({ status: 500, success: false, message: err.message });
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
    console.log(
      req.decoded._id +
        " DEBUG START: sendMessage" +
        JSON.stringify(req.body, null, 4)
    );

    var chatID = req.body.chatID;
    var message = new ChatMessage({
      _id: uuidv4(),
      user: req.body.user,
      text: req.body.message,
      createdAt: new Date(),
    });

    var chat = await ChatList.get(chatID);
    console.log("Chat: " + chat);

    var lastMessages = [];

    chat.messages.filter((item) => lastMessages.push(item._id));

    var messages =
      lastMessages == undefined
        ? [message._id]
        : [...lastMessages, message._id];

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
