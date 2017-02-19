var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var exercise = mongoose.model('exercise');

module.exports.getExercises = function(req, res) {
    console.log(req.route.path);
    
    exercise.find(function(err, data){
        if(err){
            console.log(err); 
        } else{
            res.json(data);
        }
    });
};

module.exports.getSingleExercise = function(req, res) {
    console.log(req.route.path);
    exercise.find({ _id : req.body.exercise}, function(err, data){
        if(err){ return err; }
        console.log(data);
        res.json(data);
    });
};


module.exports.postExercise = function(req, res) {
    console.log(req.route.path);
    
    var newPost = new exercise();
    
    //gotta change this to text and all that stuff
    newPost.name = req.body.name;
    newPost.description = req.body.description;
    
    newPost.save(function(err){
        if(err){
            res.json(err);
        }else{
            res.json({'message':'success'});
        }
        
    });
};