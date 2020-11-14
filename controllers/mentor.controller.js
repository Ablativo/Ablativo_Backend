const Room = require("../models/room.model.aws");
const Device = require("../models/device.model.aws");
const Mentor = require("../models/mentor.model.aws");

var config = require("../config.js");
const path = require("path");

const { v4: uuidv4 } = require("uuid");

exports.createMentor = async (req, res) => {
  try {
    console.log(" DEBUG START: createMentor " + req.body);

    const _id = uuidv4();

    var mentor = new Mentor({
      _id: _id,
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      initialMessage: req.body.initialMessage,
      interactionQuestions: req.body.interactionQuestions,
      questions: req.body.question,
    });

    await mentor.save((err, mentorSaved) => {
      if (!err) {
        console.log(
          " INFO PARAM OUT: createMentor : " +
            JSON.stringify(mentorSaved, undefined, 4)
        );

        res.send({ success: true, status: 200, data: mentorSaved });
      } else {
        console.error(" ERROR: createMentor error > " + err);
        res.send({ success: false, status: 500, message: err });
      }
    });
  } catch (e) {
    console.error(" CATCH: createMentor " + e);
    return res.send({ success: false, message: e.message });
  }
};

exports.getMentorByName = async (req, res) => {
  try {
    var mentorName = req.query.mentorName.toLowerCase();
    mentorName = mentorName[0].toUpperCase() + mentorName.slice(1);

    console.log(" DEBUG START: getMentorByName", mentorName);
    
    await Mentor.query("name")
      .eq(mentorName)
      .exec((err, mentor) => {
        if (!err) {
          console.log(
              " INFO PARAM OUT: getMentorByName : " +
              JSON.stringify(mentor, undefined, 4)
          );
          res.send({ success: true, status: 200, data: mentor });
        } else {
          console.error(
              " ERROR: getMentorByName : mentor error > " +
              JSON.stringify(err)
          );
          res.send({ success: false, message: err });
        }
      });
    console.log(" DEBUG END: getMentorByName ");
  } catch (e) {
    console.error(" CATCH: getMentorByName : mentor error > " + e);
    return res.send({ success: false, message: e.message });
  }
};
