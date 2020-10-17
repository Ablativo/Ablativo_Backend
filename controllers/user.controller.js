const User = require("../models/user.model.aws");
const Visit = require("../models/visit.model.aws");

var config = require("../config.js");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const path = require("path");

const { v4: uuidv4 } = require("uuid");

const Device = require("../models/device.model.aws");


//MUSIC MODULES
const mvae = require('@magenta/music/node/music_vae');
const core = require('@magenta/music/node/core');
const MidiWriter = require("midi-writer-js");


//DONE

exports.getMyInfo = (req, res) => {
  try {
    console.log(req.decoded._id + " DEBUG START: getMyInfo");
    var userId = req.decoded._id;

    User.query("_id")
      .eq(userId)
      .attributes(["username", "mentor", "counter"])
      .exec((err, user) => {
        if (!err) {
          console.log(
            req.decoded._id +
              " INFO PARAM OUT: getMyInfo : " +
              JSON.stringify(user, undefined, 4)
          );
          res.send({ success: true, status: 200, data: user });
        } else {
          console.error(
            req.decoded._id +
              " ERROR: getMyInfo : user error > " +
              JSON.stringify(err)
          );
          res.send({ success: false, message: err });
        }
      });
    console.log(req.decoded._id + " DEBUG END: getMyInfo");
  } catch (e) {
    console.error(req.decoded._id + " CATCH: getMyInfo : user error > " + e);
    return res.send({ success: false, message: e.message });
  }
};

exports.getMyVisits = async (req, res) => {
  try {
    console.log(req.decoded._id + " DEBUG START: getMyVisits");
    var userId = req.decoded._id;

    await Visit.query("_userID")
      .eq(userId)
      .exec((err, visit) => {
        if (!err) {
          console.log(
            req.decoded._id +
              " INFO PARAM OUT: getMyVisits : " +
              JSON.stringify(visit, undefined, 4)
          );
          res.send({ success: true, status: 200, data: visit });

          //res.send({ success: true, status: 200, data: visit});
        } else {
          console.error(
            req.decoded._id +
              " ERROR: getMyVisits : visit error > " +
              JSON.stringify(err)
          );
          res.send({ success: false, message: err });
        }
      });
    console.log(req.decoded._id + " DEBUG END: getMyVisits ");
  } catch (e) {
    console.error(req.decoded._id + " CATCH: getMyVisits : visit error > " + e);
    return res.send({ success: false, message: e.message });
  }
};

exports.createVisit = (req, res) => {
  try {
    console.log(req.decoded._id + " DEBUG START: createVisit");
    var userId = req.decoded._id;
    const _id = uuidv4();

    var visit = new Visit({
      //_id: _id,
      _userID: userId,
      museum: req.body.museum,
      location: req.body.location,
      time: req.body.time,
      musicLink: req.body.musicLink,
      createdAt: req.body.createdAt,
      image: req.body.image,
    });

    visit.save((err, visitSaved) => {
      if (!err) {
        console.log(
          req.decoded._id +
            " INFO PARAM OUT: createVisit : " +
            JSON.stringify(visitSaved, undefined, 4)
        );
        res.send({ success: true, status: 200, data: visitSaved });
      } else {
        console.error(
          req.decoded._id +
            " ERROR: createVisit : visit error > " +
            JSON.stringify(err)
        );
        res.send({ success: false, status: 500, message: err });
      }
    });
    console.log(req.decoded._id + " DEBUG END: createVisit");
  } catch (e) {
    console.error(req.decoded._id + " CATCH: createVisit : user error > " + e);
    return res.send({ success: false, status: 500, message: e.message });
  }
};

//////// WORK IN PROGRESS ////////
exports.endVisit = (req, res) => {
  try {
    console.log(req.decoded._id + " DEBUG START: endVisit");
    var userId = req.decoded._id;
    now = Date.now()/1000
    console.log(now)

    // Retrieve device telemetries
    test = Device.scan().where('dateTime').ge(now-3600)
      .exec((err, device) => {
        console.log(device)
      });

/*
    track.addEvent([
            new MidiWriter.NoteEvent({pitch: ['21','22'], duration: '4'}),
            new MidiWriter.NoteEvent({pitch: ['23'], duration: '2'}),
            new MidiWriter.NoteEvent({pitch: ['24','25'], duration: '4'}),
            new MidiWriter.NoteEvent({pitch: ['26'], duration: '2'}),
            new MidiWriter.NoteEvent({pitch: ['27', 'C7', 'C7', 'C7', 'D7', 'D7', 'D7', 'D7'], duration: '8'}),
            new MidiWriter.NoteEvent({pitch: ['E7','D7'], duration: '4'}),
            new MidiWriter.NoteEvent({pitch: ['C7'], duration: '2'})
        ], function(event, index) {
        return {sequential: true};
      }
    );
*/
    var track = new MidiWriter.Track();
    track.addEvent(NOTES_SEQUENCE);
    const writer = new MidiWriter.Writer(track);
    writer.saveMIDI('./prova');

   console.log(req.decoded._id + " DEBUG END: endVisit");
  } catch (e) {
    console.error(req.decoded._id + " CATCH: endVisit : user error > " + e);
    return res.send({ success: false, status: 500, message: e.message });
  }
};

//TODO

//logoutUser
