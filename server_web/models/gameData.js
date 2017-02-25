var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var gameDataSchema   = new Schema({
    
    patient: { type: Schema.ObjectId, ref: 'User' },
    exercise: { type: Schema.ObjectId, ref: 'exercise' },
    
    date: { type: Date, default: Date.now },
    exerciseDuration: Number,//time it took to complete
    timeStamp: [],
    canvasX:[],
    canvasY:[],
    pressureAxial: [],
    pressureA:[],
    pressureB:[],
    pressureC:[],
    penX: [],
    penY: [],
    penZ: [],
    penQw: [],
    penQx: [],
    penQy: [],
    penQz: []
    
});

module.exports = mongoose.model('gameData', gameDataSchema);

