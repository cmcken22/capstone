var express = require ('express');
var router = express.Router();
var mongoose = require('mongoose');
var event = mongoose.model('event');
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
}

module.exports.postEvent = function(req, res)
{
    console.log(req.route.path);
    
  
    var newPost = new event();
    
    newPost.patient = req.body.patient;
    newPost.doctor = req.body.doctor;
    newPost.exercise = req.body.exercise; 
    newPost.type = req.body.type; 
    newPost.description = req.body.description;
    newPost.date = req.body.date;
    newPost.endTime = req.body.endTime;
    newPost.eventLog= req.body.eventLog;
    newPost.completed = req.body.completed;
    
   
        newPost.save(
            function(err)
            {
                if(err)
                {
                    res.send(err);
                    return;
                }
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
            
           day.add(req.body.skip, req.body.rOption);
           eday.add(req.body.skip, req.body.rOption);
           
           newPost.date=day.toJSON();
           newPost.endTime = eday.toJSON();
           console.log(end);
           
             newPost.save(function(err){if(err){res.send(err);}});
        }while(day.diff(end)<0)
        
    }
};

module.exports.createData = function(req, res){
    // console.log(req.route.path);
    // var newPost = new event();
    
    // var patient = "58a2492c17180e1a95892b86"; //john smith
    // var exercise = "58a293e70457a8252eead52e"; //get pumped - i think
    // var doctor = "58a2491817180e1a95892b85";
    
    // newPost.patient = patient;
    // newPost.doctor = doctor;
    // newPost.exercise = exercise;
    // //whether the event is an appointment or not?
    // newPost.type = null;
    // newPost.description = 'emtpy description'
    // newPost.date = 
    // //for the calendar
    // newPost.endTime:
    
    // //date that the exercise was completed
    // newPost.completed: 
    // newPost.completedDate:
    // //data for 1 game, will only be present should it be complete
    // newPost.gameData:
    
    // newPost.save(
    //     function(err)
    //     {
    //         if(err)
    //         {
    //             res.send(err);
    //             return;
    //         }
    //     });
    
};
