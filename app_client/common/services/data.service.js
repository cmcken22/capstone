/*global angular*/

(function() {

  angular
    .module('mainApp')
    .service('dataService', dataService);

  dataService.$inject = ['$http', 'authentication'];
  
  function dataService ($http, authentication) {
    // -----------------------
    //        Users
    // -----------------------
    var getProfile = function () {
      return $http.get('/api/profile');
    };
    var getPatients = function () {
      console.log('getPatients Service')
      return $http.get('/api/get-patients');
    };
    var getDoctor = function () {
      return $http.get('/api/get-doctor');
    };
    
    
    // -----------------------
    //        Messages
    // -----------------------
    var doctorPostMessage = function(data) {
      return $http.post('/api/doctor-post-message', data);
    };
    var patientPostMessage = function(data) {
      return $http.post('/api/patient-post-message', data);
    };
    var toggleMessage = function(data) {
      return $http.post('/api/toggle-message', {'message':data});
    };
    var numUnreadMessages = function() {
      return $http.get('/api/num-unread-messages');
    };
    var getMessages = function() {
      console.log('getting messages')
      return $http.get('/api/get-messages');
    };
    
    var postReply = function(data){
      return $http.post('/api/post-reply', data);
    }
    var getReplys = function(id){
      return $http.get('/api/get-replys/' + id);
    }
    
    
    // -----------------------
    //        Exercises
    // -----------------------
    var getExercise = function(){
      return $http.get('/api/get-exercises');
    };
    var getSingleExercise = function(data){
      console.log('Sending to server:')
      console.log(data);
      return $http.post('/api/get-single-exercise', {
        exercise: data
      });
    };
    var postExercise = function(data){
      return $http.post('/api/post-exercise', data);
    };
    
    // -----------------------
    //        Events
    // -----------------------
    var getEvents = function(){
      return $http.get('/api/get-event');
    };
    var getPatientEvents = function(){
      return $http.get('/api/get-patientevent');
    };
    var postEvent = function(data){
      return $http.post('/api/post-event', data);
    };
    
    
    
    // -----------------------
    //        Game Data
    // -----------------------
    var getGameData = function () {
      return $http.get('/api/get-gamedata');
    };
    
    var generateGameData = function () {
      console.log('getting');
      return $http.post('/api/generate-gamedata');
      
    };
    
    var querySingleDate = function (date) {
      return $http.post('/api/query-gamedata-single', {
        date: date
      });
    };
    
    var queryDateRange = function (d1, d2, patient, exercise) {
      return $http.post('/api/query-gamedata-range', {
        startDate: d1,
        endDate: d2,
        patient: patient,
        exercise: exercise,
      });
    };
    
    var queryMonth = function (d1, d2) {
      return $http.post('/api/query-gamedata-month', {
        startDate: d1,
        endDate: d2,
      });
    };
    
    //used for debugging - to post dummy gameData
    var postGameData = function (gameData) {
      return $http.post('/api/post-gamedata', {
        date: gameData.date,
        time: gameData.time,
        code: gameData.code,
        pressure: gameData.pressure,
      });
    };
    
    
    
    
    return {
      getProfile : getProfile,
      getPatients : getPatients,
      getDoctor : getDoctor,
      
      doctorPostMessage : doctorPostMessage,
      patientPostMessage : patientPostMessage,
      toggleMessage : toggleMessage,
      numUnreadMessages: numUnreadMessages,
      getMessages : getMessages,
      postReply : postReply,
      getReplys : getReplys,
      
      getExercise : getExercise,
      getSingleExercise : getSingleExercise,
      postExercise : postExercise,
      getEvent : getEvents,
      postEvent : postEvent,
      getPatientEvents : getPatientEvents,
      
      getGameData : getGameData,
      postGameData : postGameData,
      querySingleDate: querySingleDate,
      queryDateRange: queryDateRange,
      queryMonth: queryMonth,
      generateGameData: generateGameData,
    };
  }

})();