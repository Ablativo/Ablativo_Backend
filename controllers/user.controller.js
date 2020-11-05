const User = require("../models/user.model.aws");
const Visit = require("../models/visit.model.aws");

var config = require("../config.js");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const path = require("path");

const { v4: uuidv4 } = require("uuid");

const Utility = require("./utility/music.utility");

const Device = require("../models/device.model.aws");

//MUSIC MODULES
const core = require("@magenta/music/node/core");
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
      _id: _id,
      _userID: userId,
      museum: req.body.museum,
      location: req.body.location,
      createdAt: new Date(),
    });

    visit.save((err, visitSaved) => {
      if (!err) {
        console.log(
          req.decoded._id +
            " INFO PARAM OUT: createVisit : " +
            JSON.stringify(visitSaved, undefined, 4)
        );
        res.send({ success: true, status: 200, data: visitSaved, visitID: _id  });
      } else {
        console.error(
          req.decoded._id +
            " ERROR: createVisit : visit error > " +
            JSON.stringify(err)
        );
        res.send({ success: false, status: 500, message: err,});
      }
    });
    console.log(req.decoded._id + " DEBUG END: createVisit");
  } catch (e) {
    console.error(req.decoded._id + " CATCH: createVisit : user error > " + e);
    return res.send({ success: false, status: 500, message: e.message });
  }
};

exports.endVisit = (req, res) => {
  try {
    console.log(
      req.decoded._id + " DEBUG START: endVisit",
      JSON.stringify(req.body, null, 4)
    );
    var now = Date.now() / 1000;

    // Retrieve device telemetries
    Device.scan("dateTime")
      .ge(now - 3600)
      .exec((err, devices) => {
        if (!err) {
          let notes = [];

          // Retrieve Ambiental Telemetries from DB
          devices.forEach((device) => {
            notes.push(Utility.num_normalizer(device.Payload.hum, "melody"));
            notes.push(Utility.num_normalizer(device.Payload.temp, "melody"));
            notes.push(Utility.num_normalizer(device.Payload.press, "melody"));
          });

          // Retrieve Smartphone Telemetries from body
          req.body.telemetries.forEach((s) => {
            notes.push(Utility.num_normalizer((s.x + s.y + s.z) / 3), "melody");
            // Retrive values of the heart rate sensor (TO DO)
          });

          // CREATING SEQUENCE
          console.log("CREATING SEQUENCE");
          let SEQUENCE = {
            notes: [],
            totalTime: notes.length / 2 + 1,
          };

          let startTime = 0.0;
          notes.forEach((n) => {
            SEQUENCE["notes"].push({
              pitch: n,
              startTime: startTime,
              endTime: startTime + 0.5,
            });
            startTime = startTime + 0.5;
          });

          // Quantized SEQUENCE
          const quantizedSequence = core.sequences.quantizeNoteSequence(
            SEQUENCE,
            1
          );

          // Continuing SEQUENCE with RNN
          const mrnn = require("@magenta/music/node/music_rnn");
          //const model = new mrnn.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn');
          const model = new mrnn.MusicRNN(
            "https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/melody_rnn"
          );
          model.initialize();
          let rnn_steps = 60;
          let rnn_temperature = 1.5;

          model
            .continueSequence(quantizedSequence, rnn_steps, rnn_temperature)
            .then((sample) => {
              var track = new MidiWriter.Track();
              sample.notes.forEach((n) => {
                let number_note = n["pitch"].toString();
                let duration = 2 ** (Math.floor(Math.random() * 4) + 1);
                let note = new MidiWriter.NoteEvent({
                  pitch: [number_note],
                  duration: parseInt(duration),
                });
                track.addEvent(note, (event, index) => {
                  return { sequential: true };
                });
              });
              // Save Music
              const writer = new MidiWriter.Writer(track);
              //writer.saveMIDI('./prova');
              let musicURI = writer.dataUri();
              console.log(musicURI);
              console.log("Done: MUSIC GENERATED !!!");
            });
          /*
Update the visit params on the DB (TO DO)
          Visit.update(
            {
              _id: req.body._id,
              musicLink: musicURI,
              finishedAt: new Date(),
            },
            (error, visitSaved) => {
              if (error) {
                console.error(
                  req.decoded._id +
                    " ERROR: sendMessage on update room error > " +
                    err
                );
                res.send({ success: false, status: 500, message: err });
              } else {
                console.log(
                  req.decoded._id +
                    " INFO PARAM OUT: sendMessage : " +
                    JSON.stringify(visitSaved, undefined, 4)
                );
                res.send({ success: true, status: 200, data: visitSaved });
              }
            });
*/
        } else {
          console.error(
            req.decoded._id +
              " ERROR: endVisit : error  >  " +
              JSON.stringify(err)
          );
          res.send({ success: false, message: err });
        }
      });

    console.log(req.decoded._id + " DEBUG END: endVisit");
  } catch (e) {
    console.error(req.decoded._id + " CATCH: endVisit : user error > " + e);
    return res.send({ success: false, status: 500, message: e.message });
  }
};
