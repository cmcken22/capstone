var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var exerciseSchema   = new Schema({
    
    name: { 
        type: String,
        unique: true
    },
    description: { 
        type: String
    }
    
});

module.exports = mongoose.model('exercise', exerciseSchema);