var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var messageSchema   = new Schema({
    
    sender: { type: Schema.ObjectId, ref: 'User' },
    receiver: { type: Schema.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    messageSubject: String,
    messageBody: String,
    read: Boolean,
    replys: [{ type: Schema.ObjectId, ref: 'reply' }],
});

module.exports = mongoose.model('message', messageSchema);