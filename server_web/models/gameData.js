var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var gameDataSchema   = new Schema({
    
    //have fun conner
    patient: { type: Schema.ObjectId, ref: 'User' },
    //code: Number, //used now as the exercise but will be overwritten soon
    exercise: { type: Schema.ObjectId, ref: 'exercise' },
    date: { type: Date, default: Date.now },
    time: Number,//thime it took to complete
    pressure: [],
    X:[],
    Y:[],
    pressureA:[],
    pressureB:[],
    pressureC:[]
    
});

module.exports = mongoose.model('gameData', gameDataSchema);

