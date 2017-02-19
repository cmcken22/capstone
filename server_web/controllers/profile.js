var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.profileRead = function(req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    User.findById(req.payload._id)
      .exec(function(err, user) {
        res.status(200).json(user);
      });
  }

};

module.exports.getPatients = function(req, res) {

  if (req.payload.role != 'doctor') {
    res.status(401).json({
      "message" : "UnauthorizedError: wrong role"
    });
  } else {
    User.findOne({ _id: req.payload._id }, function(err, user){
      User.find({ _id: user.patients }, ['name','email'] ,function(err, patientList){
        res.status(200).json(patientList);
      })
    });
  }

};

module.exports.getDoctor = function(req, res) {
  console.log('/get-doctor')
  if (req.payload.role != 'patient') {
    res.status(401).json({
      "message" : "UnauthorizedError: wrong role"
    });
  } else {
    
    User.findOne({ _id: req.payload._id }, function(err, user){
      User.findOne({ _id: user.doctor }, ['name','email'] ,function(err, doctor){
        res.status(200).json(doctor);
      })
    });
  }

};