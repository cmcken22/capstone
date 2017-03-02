var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Message = mongoose.model('message');
var User = mongoose.model('User');
var Reply = mongoose.model('reply');

module.exports.doctorPostMessage = function(req, res) {
    console.log('/doctor-post-message');
    var newMessage = new Message();
    
    newMessage.receiver = req.body.patientId;
    newMessage.sender = req.payload._id;
    newMessage.messageSubject = req.body.messageSubject;
    newMessage.messageBody = req.body.messageBody;
    newMessage.read = false;
    
    newMessage.save(function(err){
        if(err) {
            res.json(err);
        }else{
            res.json({'message':'Success'});
        }
    });
};

module.exports.patientPostMessage = function(req, res) {
    console.log('/patient-post-message');
    console.log(req.body);
    User.findOne({ _id : req.payload._id}, function(err, user){
        if(err){
            res.json(err);
        }else{
            var newMessage = new Message();
            console.log(user);
            newMessage.receiver = user.doctor;
            newMessage.sender = req.payload._id;
            newMessage.messageSubject = req.body.messageSubject;
            newMessage.messageBody = req.body.messageBody;
            newMessage.read = false;
            newMessage.save(function(err){
                if(err) {
                    res.json(err);
                }else{
                    res.json({'message':'Success'});
                }
            });
        }
    });
};
module.exports.toggleMessage = function(req, res) {
    
    Message.findOne({ _id : req.body.message}, function(err, readMessage){
        if(err){res.json(err);}
        if(readMessage){
            if(readMessage.read) readMessage.read = false;
            else readMessage.read = true
            readMessage.save();
            res.status(200);
            res.json({
                "message" : "success"
            });
        }
    })
}
module.exports.numNewMessages = function(req, res) {
    console.log('/num-unread-messages');
    // if(req.payload.role == 'patient'){
        Message.count({ receiver : req.payload._id, read:false}, function(err, num){
            res.status(200).json({'count':num})
        });
    // }
}


module.exports.getMessages = function(req, res) {
    console.log('/get-messages');
    Message.find({ $or:[ {'receiver':req.payload._id}, {'sender':req.payload._id} ]}, function(err, data){
        if(err) {
            console.log(err)
            res.json(err);
        }else{
            res.json(data);
        }
    });
};

module.exports.getReplys = function(req, res) {
    Message.findOne({ _id : req.params.messageid}, function(err, message){
        if(err){ res.json(err);}
        Reply.find({_id : message.replys}, function(err, data){
            if(err){ res.json(err);}
            else{
                 res.json(data);
            }
        })
    })
};

module.exports.postReply = function(req, res) {
    Message.findOne({ _id : req.body.message}, function(err, message){
        if(err) {
            res.json(err);
        }else{
            var newReply = new Reply();
            newReply.body = req.body.body;
            newReply.sender = req.payload._id;
            
            newReply.save(function(err){
                if(err){ res.json(err);}
                else {
                    res.json({'message':'success'});
                    message.replys.push(newReply);
                    message.save();
                }
            });
        }
    });
};
