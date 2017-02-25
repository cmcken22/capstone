var express = require('express');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var socketIO = require('socket.io');
var nodemailer = require('nodemailer');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));
app.use(passport.initialize());

var webAPI = require('./server_web/web_server');
app.use('/api', webAPI.router.routes);
app.use(webAPI.router.sendHTML);

// var io2 = require('socket.io').listen(8081);

// io2.sockets.on('connection', function (socket2) {
//   console.log('How about this you piece of trash?');

//   socket2.on('disconnect', function () {
//     console.log('Fuck you');
//   });
// });

var socketAPI = require('./server_socket/server_socket');
io.on('connection', socketAPI.onConnection);


console.log("We're partying at https://capstone-rfreethy.c9users.io:8080");
server.listen(8080);