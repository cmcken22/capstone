var passport = require('passport');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var User = mongoose.model('User');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    //console.log('auth function');
    User.findOne({ email: username }, function (err, user) {
      //console.log('find one function');
      if (err) { return done(err); }
      // Return if user not found in database
      if (!user) {
        return done(null, false, {
          message: 'User not found'
        });
      }
      // Return if password is wrong
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Password is wrong'
        });
      }
      // If credentials are correct, return the user object
      return done(null, user);
    });
  }
));




var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {

  // if(!req.body.name || !req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }

  var user = new User();

  user.name = req.body.name;
  user.email = req.body.email;
  user.role = req.body.role;

  user.setPassword(req.body.password);
  
  user.save(function(err) {
    if(err) {
      res.json(err);
    }
    var token;
    token = user.generateJwt();
    res.status(200);
    res.json({
      "token" : token
    });
  });
};


module.exports.registerPatient = function(req, res) {

  //console.log(req.body);
  //console.log(req.payload);
  User.findOne({email : req.body.email},function(err, results) {
    if(results){
      res.status(409).json({'message':'Patient already exhists'});
    }else{
      var newPatient = new User();
      
      newPatient.name = req.body.name;
      newPatient.email = req.body.email;
      newPatient.role = 'patient';
    
      newPatient.setPassword(req.body.password);
      newPatient.doctor = req.payload._id;
      
      newPatient.save(function(err) {
        if(err) {
          res.json(err);
        } else {
          res.status(200);
          res.json({
            "message" : "User was successfully created"
          });
        }
      }).then(function(){
        User.findOne({ _id: req.payload._id }, function(err, user){
          if(err) {
            res.json(err);
          }else{
            user.patients.push(newPatient);
            user.save();
          }
          newPatient.generateJwt();
        });
      })
    }
  });
  

};

module.exports.login = function(req, res) {

  // if(!req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }

  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
      
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};
