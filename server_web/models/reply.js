var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var replySchema   = new Schema({
    sender: { type: Schema.ObjectId, ref: 'User' },
    body: String,
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('reply', replySchema);