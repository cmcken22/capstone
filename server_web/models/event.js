var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var eventSchema   = new Schema({
    //the event should have: 
    //user id 
    //exercise id 
    //time
    //date
    
    //the patient for whom the event was created
    patient: { 
        type: Schema.ObjectId, ref:'User',
    },
    //doctor who prescribed the event
    doctor: { 
        type: Schema.ObjectId, ref:'User',
    },
    //the required exercise
    exercise: { 
        type: Schema.ObjectId, ref:'exercise',
        required:false
    },
    //whether the event is an appointment or not?
    type: {
        type: String
    },
    description: {type:String},
    date: {
        //also has start time
        type: Date 
    },
    //for the calendar
    endTime:{
        type:Date
    },
    //date that the exercise was completed
    timeLimit:{
        type: String,
    },
    alphaFilter:{
        type:String
    },
    gripThreshold:{
        type:String,
    },
    axialThreshold:{
        type:String,
    },
    completed:{
      type: Boolean,
    },
    completedDate:{
        type:Date,
        required:false,
    },
    //data for 1 game, will only be present should it be complete
    gameData:{
        type: Schema.ObjectId,
        ref:'gameData',
        required:false
    }
    
    
});

module.exports = mongoose.model('event', eventSchema);