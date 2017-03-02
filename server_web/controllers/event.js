var express = require ('express');
var router = express.Router();
var mongoose = require('mongoose');
var event = mongoose.model('event');
var User = mongoose.model('User');
var moment = require('moment');
module.exports.getEvent = function(req, res){
    console.log('/get-allevents');
    console.log(req.route.path);
    
    event.find(
        function(err,event)
        {
            if(err)
            {
                return err;
            }
            res.json(event);
        }
        );
};

//the request has the user's ID so that we only return relevant info. 
module.exports.getPatientEvent = function (req, res)
{
    console.log('/get-patientevent');
    //lookfor specific dude's events
    var lookfor= req.data.user; 
    event.find({user: lookfor},
    function(err,event)
    {
        if(err)
        {
            return err;
        }
        res.json(event);
    });
}
module.exports.getEventByPatientId = function (req, res)
{
    console.log('/get-event by patientID');
    //lookfor specific dude's events
   
    var ID= req.body._id; 
    console.log("backend: " +ID);
    event.find({patient: ID},
    function(err,event)
    {
        if(err)
        {
            return err;
        }
        res.json(event);
    });
//     if (req.payload.role != 'doctor') {
//     res.status(401).json({
//       "message" : "UnauthorizedError: wrong role"
//     });
//   } else {
//     User.findOne({ _id: req.payload._id }, function(err, user){
//       User.find({ _id: user.patients }, ['name','email','_id'] ,function(err, patientList){
//         res.status(200).json(patientList);
//         //patientList.each(function(onePatient){
            
//             //console.log(onePatient)
//         //})
//       })
//     });
//   }
    
}

module.exports.postEvent = function(req, res)
{
    console.log(req.route.path);
    
  
    var newPost = new event();
    
    newPost.patient = req.body.patient;
    newPost.doctor = req.payload._id;
    newPost.exercise = req.body.exercise; 
    newPost.type = req.body.type; 
    newPost.description = req.body.description;
    newPost.date = req.body.date;
    newPost.endTime = req.body.endTime;
    newPost.eventLog= req.body.eventLog;
    newPost.completed = req.body.completed;
    // newPost.timeLimit = req.body.timeLimit;
    // newPost.alphaFilter = req.body.alphaFilter;
    // newPost.gripThreshold = req.body.gripThreshold;
    // newPost.axialThreshold = req.body.axialThreshold;
   console.log(req.body);
    newPost.save(function(err){
        if(err){
            res.send(err);
            return;
        }
        //if(!req.body.repeat){
        res.send({'message':'success'})
        //}
    });
    
   if(req.body.repeat){
        var day = moment(newPost.date);
        var eday = moment(newPost.endTime);
        var end = moment(req.body.dateFinish);
        do{
            newPost = new event();
    
            newPost.patient = req.body.patient;
            newPost.doctor = req.body.doctor;
            newPost.exercise = req.body.exercise; 
            newPost.type = req.body.type; 
            newPost.description = req.body.description;
           
            newPost.endTime = req.body.endTime;
            newPost.eventLog= req.body.eventLog;
            newPost.completed = req.body.completed;
            // newPost.timeLimit = req.body.timeLimit;
            // newPost.alphaFilter = req.body.alphaFilter;
            // newPost.gripThreshold = req.body.gripThreshold;
            // newPost.axialThreshold = req.body.axialThreshold;
            day.add(req.body.skip, req.body.rOption);
            eday.add(req.body.skip, req.body.rOption);
           
            newPost.date=day.toJSON();
            newPost.endTime = eday.toJSON();
            newPost.save(function(err){
                if(err){
                    console.log(err)
                }
                else {
                    console.log(newPost);
                }
            });
        }while(day.diff(end) < 0)
    }
   
};

