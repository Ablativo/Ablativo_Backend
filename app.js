const express = require("express");
const session = require("express-session");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.model.aws");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var config = require("./config.js");
const bcrypt = require("bcrypt");

// Routes
var authorization = require("./controllers/auth/authorization.middleware.js");
const userRoute = require("./routes/user.route");

// App
(app = express()), (port = process.env.PORT || 3000);
app.listen(port);

app.use("/validate", express.static(path.join(__dirname, "static", "public")));
app.use(express.json());
app.use(compression());

app.use((req, res, next) => {
  //res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, x-access-token, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "pwd",
    },
    function (username, password, done) {
      User.query("username")
        .eq(username)
        .exec((err, usr) => {
          if (err) {
            console.error(
              username + " PASSPORT  : ERROR: " + JSON.stringify(err)
            );
            return done(err);
          } else {
            if (!usr || usr.count == 0) {
              console.error(username + " PASSPORT : ERROR : User not found.");
              return done(null, false, {
                success: false,
                status: 403,
                message: "Incorrect username.",
              });
            } else if (!bcrypt.compareSync(password, usr[0].password)) {
              //usr.authenticate(password)) {
              console.error(
                username + " PASSPORT : ERROR : Incorrect password."
              );
              return done(null, false, {
                success: false,
                status: 403,
                message: "Incorrect password.",
              });
            } else {
              console.error(username + " PASSPORT : SUCCESS");
              return done(null, usr[0]);
            }
          }
          //delete usr.password;
        });
    }
  )
);

passport.serializeUser(function (user, done) {

  Object.assign({}, { x: user._id, y: user.username });
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.query("_id")
    .eq(id)
    .exec((err, user) => {
      done(err, user);
    });
});

app.use("/api", authorization.validateToken); //tutte le chiamate che usano /api saranno validate.
userRoute(app); //register the route

app.all("*", (req, res) => {
  //le restanti chiamate che non sono state mappate rintornano 404
  res.send({
    success: false,
    status: 404,
    message: "Invalid Uri Resource",
  });
});

module.exports = app;
