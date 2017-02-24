var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var path = require('path');
var passport = require('passport');

var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

//load in the controllers so we can use their methods to handle routes
var ctrlProfile = require('./controllers/profile');
var ctrlAuth = require('./controllers/authentication');
var ctrlGameData = require('./controllers/gameData');
var ctrlMessages = require('./controllers/message');
var ctrlExercise = require('./controllers/exercise');
var ctrlEvent = require('./controllers/event');

//authentication
router.post('/register', ctrlAuth.register);
router.post('/register-patient', auth, ctrlAuth.registerPatient);
router.post('/login', ctrlAuth.login);


//profile
router.get('/profile', auth, ctrlProfile.profileRead);
router.get('/get-patients', auth, ctrlProfile.getPatients);
router.get('/get-doctor', auth, ctrlProfile.getDoctor);


//game data
router.get('/get-gamedata', auth, ctrlGameData.getGameData);
router.post('/query-gamedata-single', auth, ctrlGameData.querySingleDate);
router.post('/query-gamedata-range', auth, ctrlGameData.queryDateRange);
router.post('/query-gamedata-month', auth, ctrlGameData.queryMonth);
router.post('/post-gamedata',auth, ctrlGameData.postGameData);
router.post('/generate-gamedata',auth, ctrlGameData.generateGameData);
router.post('/get-gamedata-by-id',auth,ctrlGameData.getGameDataById);
router.post('/getGameDataForPatient',auth,ctrlGameData.getGameDataForPatient)
//messages
router.post('/doctor-post-message', auth, ctrlMessages.doctorPostMessage);
router.post('/patient-post-message', auth, ctrlMessages.patientPostMessage);
router.post('/toggle-message', auth, ctrlMessages.toggleMessage);
router.get('/num-unread-messages', auth, ctrlMessages.numNewMessages);
router.get('/get-messages', auth, ctrlMessages.getMessages);

router.post('/post-reply', auth, ctrlMessages.postReply);
router.get('/get-replys/:messageid', auth, ctrlMessages.getReplys);

//exercises
router.get('/get-exercises', auth, ctrlExercise.getExercises);
router.post('/get-single-exercise', auth, ctrlExercise.getSingleExercise);
router.post('/post-exercise', auth, ctrlExercise.postExercise);


//events
router.post('/get-eventByPatientId', auth, ctrlEvent.getEventByPatientId);
router.get('/get-event', auth, ctrlEvent.getEvent);
router.get('/get-patientevent',auth, ctrlEvent.getPatientEvent);
router.post('/post-event', auth, ctrlEvent.postEvent);

module.exports.routes = router;
 
  
module.exports.sendHTML = function(req, res) {
  res.sendFile(path.join(__dirname, '../app_client', 'index.html'));
}