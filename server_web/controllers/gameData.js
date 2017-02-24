var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var gameData = mongoose.model('gameData');

module.exports.getGameData = function(req, res) {
    console.log(req.route.path);
    
    gameData.find(function(err, gameData){
        if(err){ return err; }
        res.json(gameData);
    });
};
module.exports.getGameDataById = function(req, res) {
     console.log(req.body._id);
    gameData.find({_id:req.body._id},function(err, data){
       
        if(err){ return err; }
        res.json(data);
    });
};
module.exports.querySingleDate = function(req, res) {
    console.log(req.route.path);
    
    var newDate = new Date(req.body.date);
    newDate.setUTCHours(0,0,0);
    console.log(newDate);
    
    gameData.find({ date : newDate }, function(err, data){
        if(err){ return err; }
        console.log(data);
        res.json(data);
    });
};
module.exports.getGameDataForPatient = function(req,res)
{
    console.log(req.route.path)
    console.log(req.body.patient)
    
    gameData.find({patient:req.body.patient},function(err,data){
        if(err){return err}
        res.json(data);
    })
    
}
module.exports.queryDateRange = function(req, res) {
    
    console.log(req.route.path);
    console.log("req.body:");
    console.log(req.body);
    var startDate = new Date(req.body.startDate);
    startDate.setUTCHours(0,0,0);
    
    var endDate = new Date(req.body.endDate);
    endDate.setUTCHours(0,0,0);
    console.log(startDate + " - " + endDate);
    
    //var exercise = req.body.exercise;
    // var patient = req.body.patient;
    
    console.log("Exercise: ");
    console.log(req.body.exercise);
    console.log("Patient: ");
    console.log(req.body.patient);
    
    gameData.find({ date : {$gte : startDate, $lte: endDate}, exercise: req.body.exercise, patient: req.body.patient}, function(err, data){
        if(err){ return err; }
        console.log('DATA TO BE RETURNED: ');
        console.log(data);
        res.json(data);
    });
};

module.exports.queryMonth = function(req, res) {
    
    console.log(req.route.path);
    
    var startDate = new Date(req.body.startDate);
    startDate.setUTCHours(0,0,0);
    
    var endDate = new Date(req.body.endDate);
    endDate.setUTCHours(0,0,0);
    console.log(startDate + " - " + endDate);
    
    gameData.find({ date : {$gte : startDate, $lte: endDate}}, function(err, data){
        if(err){ return err; }
        console.log(data);
        res.json(data);
    });

        
};

module.exports.postGameData = function(req, res) {
    console.log(req.route.path);

    var newPost = new gameData();
    // newPost.date = Date.now(); //use this line when communicating with unity
    newPost.date = req.body.date; //use this for sumbmitting dummy data
    newPost.time = req.body.time;
    newPost.code = req.body.code;
    newPost.pressure = req.body.pressure;
    
    console.log('added: ' + req.body.pressure);
    
    newPost.save(function(err){
        if(err){
            res.send(err);
            return;
        }
    });
};

module.exports.generateGameData = function(req, res) {
    console.log(req.route.path);
    
    console.log('Generating random data');
    
    var patient = "58a2492c17180e1a95892b86";

    var date = new Date();
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    console.log('initial date: ' + date);
    
    var newPosts = [];
    
    for(var i=0; i<60; i++){
        
        var newPost = new gameData();
        
        newPost.patient = patient;
        
        date = new Date();
        date.setDate(1);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        date.setDate(date.getDate() + i);
        
        newPost.date = date;
        newPost.time = Math.floor((Math.random() * 20) + 1);
        
        newPost.code = "100";
        newPost.exercise = "58a293e70457a8252eead52e";
        for(var j=0; j<20; j++){
            newPost.pressure[j] = Math.floor((Math.random() * 10) + 1);
        }
        
        console.log("--------Adding--------");
        console.log("Date: " + newPost.date);
        console.log("Time: " + newPost.time);
        console.log("Pressure: " + newPost.pressure);
        
        
        newPost.save(function(err){
            if(err){
                res.send(err);
                return;
            }
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Saved: ' + i);
        });
        
    }
    
    date = new Date();
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    console.log('initial date: ' + date);
    
    var newPosts = [];
    
    for(var i=0; i<60; i++){
        
        var newPost = new gameData();
        
        newPost.patient = patient;
        
        date = new Date();
        date.setDate(1);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        date.setDate(date.getDate() + i);
        
        newPost.date = date;
        
        newPost.time = Math.floor((Math.random() * 20) + 1);
        
        newPost.code = "101";
        newPost.exercise = "58a600063c0d8f13a3980e9d";
        for(var j=0; j<20; j++){
            newPost.pressure[j] = Math.floor((Math.random() * 20) + 1);
        }
        
        console.log("--------Adding--------");
        console.log("Date: " + newPost.date);
        console.log("Time: " + newPost.time);
        console.log("Pressure: " + newPost.pressure);
        
        
        newPost.save(function(err){
            if(err){
                res.send(err);
                return;
            }
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Saved: ' + i);
        });
        
    }
    
    date = new Date();
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    console.log('initial date: ' + date);
    
    var newPosts = [];
    
    
    for(var i=0; i<60; i++){
        
        var newPost = new gameData();
        
        newPost.patient = patient;
        
        date = new Date();
        date.setDate(1);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        date.setDate(date.getDate() + i);
        
        newPost.date = date;
        
        newPost.time = Math.floor((Math.random() * 20) + 1);
        
        newPost.code = "102";
        newPost.exercise = "58a607b33c0d8f13a3980e9e";
        for(var j=0; j<20; j++){
            newPost.pressure[j] = Math.floor((Math.random() * 30) + 1);
        }
        
        console.log("--------Adding--------");
        console.log("Date: " + newPost.date);
        console.log("Time: " + newPost.time);
        console.log("Pressure: " + newPost.pressure);
        
        
        newPost.save(function(err){
            if(err){
                res.send(err);
                return;
            }
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Saved: ' + i);
        });
        
    }
};