//Mongoose init
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/capstone');
mongoose.Promise = global.Promise;

//Bring in the data models
 require('./models/user');
require('./models/gameData');
require('./models/message');
require('./models/reply');
require('./models/exercise');

require('./models/event');


//This module will export all of the http get/post routes
//These routes will be referenced from server.js and accessed from the route ".../api/*"
module.exports.router = require ('./routes');

// var path = require('path');
// var passport = require('passport');
