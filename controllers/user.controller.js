const User = require("../models/user.model.aws");
const Visit = require("../models/visit.model.aws");

var config = require("../config.js");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const path = require("path");

const { v4: uuidv4 } = require("uuid");

const Utility = require("./utility/music.utility")

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
    now = Date.now()/1000

    /***  SALVARE TIMESTAMP FINE VISITA ***/

    // Retrieve device telemetries
    Device.scan('dateTime')
      //.ge((now-3600))
      .exec((err, devices) => {
        if (!err) {

          notes = []

          // Retrieve Ambiental Telemetries from DB
          devices.forEach(device => {
            notes.push(Utility.num_normalizer(device.Payload.hum))
            notes.push(Utility.num_normalizer(device.Payload.temp))
            notes.push(Utility.num_normalizer(device.Payload.press))
          });

          // Retrieve Smartphone Telemetries from body
          req.body.telemetries.forEach(s => {
            notes.push(Utility.num_normalizer((s.x + s.y + s.z)/3))
          });

          console.log(notes)


          // CREATING SEQUENCE
          console.log("CREATING SEQUENCE")
          SEQUENCE = {
            notes: [],
            totalTime: (notes.length)/2 + 1
          }

          startTime = 0.0
          notes.forEach(n => {
            SEQUENCE['notes'].push({pitch: n, startTime: startTime, endTime: startTime+0.5})
            startTime = startTime+0.5
          });

          // Quantized SEQUENCE
          const quantizedSequence = core.sequences.quantizeNoteSequence(SEQUENCE, 1)

          // Continuing SEQUENCE with RNN
          const mrnn = require('@magenta/music/node/music_rnn');
          const model = new mrnn.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn');
          model.initialize();
          rnn_steps = 60;
          rnn_temperature = 1.5;

          model
          .continueSequence(quantizedSequence, rnn_steps, rnn_temperature)
          .then((sample) => {
              //console.log(sample);
              var track = new MidiWriter.Track();     
              sample.notes.forEach(n => {
                number_note = (n['pitch']).toString()
                duration = 2**(Math.floor(Math.random() * 4)+1)
                note  = new MidiWriter.NoteEvent({pitch:[number_note], duration: parseInt(duration)})
                track.addEvent(note , (event, index) => {return {sequential: true}});
              })
              // Save Music
              const writer = new MidiWriter.Writer(track);
              console.log(track)
              //writer.saveMIDI('./prova');
              console.log(writer.dataUri())
              console.log("Done: MUSIC GENERATED !!!");
            });

        } else {
          console.error(
            req.decoded._id +
              " ERROR: endVisit : error  >  " +
              JSON.stringify(err)
          );
          res.send({ success: false, message: err });

          /*** SALVARE URI SU DYNAMO ***/
        }
      });

    console.log(req.decoded._id + " DEBUG END: endVisit");
  } catch (e) {
    console.error(req.decoded._id + " CATCH: endVisit : user error > " + e);
    return res.send({ success: false, status: 500, message: e.message });
  }
};

//TODO

//logoutUser
