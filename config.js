var exports = (module.exports = {});
var self = require("./config.js");

exports.DB = {
  development: {
    host: "mongodb://localhost/ablativo",
    user: "root",
    pwd: "",
  },
  collaudo: {
    host: "",
    user: "",
    pwd: "",
  },
};

var env = process.env.NODE_ENV ? process.env.NODE_ENV : "development";

exports.NODE_ENV = env;
exports.projectName = "Ablativo";

exports.PROTOCOL = process.env.PROTOCOL ? process.env.PROTOCOL : "http";
exports.PORT = process.env.PORT ? process.env.PORT : 8888;

exports.BASE_URL = () => {
  if (self.baseUrl) return self.baseUrl;
  else {
    let ip = require("ip");
    let ipAddress = "192.168.1.40";
    //let ipAddress = ip.address();
    return self.PROTOCOL + "://" + ipAddress + ":" + self.PORT;
  }
};

exports.MENTOR = {
	AUGUSTO: 0,
	CESARE: 1,
	NERONE: 2,
  };