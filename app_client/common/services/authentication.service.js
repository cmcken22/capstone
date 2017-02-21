(function () {

  angular
    .module('mainApp')
    .factory('authentication', authentication);

  authentication.$inject = ['$http', '$window'];
  function authentication ($http, $window) {

    var saveToken = function (token) {
      $window.localStorage['auth-token'] = token;
    };

    var getToken = function () {
      return $window.localStorage['auth-token'];
    };

    var isLoggedIn = function() {
      var token = getToken();
      var payload;

      if(token){
        payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    var currentUser = function() {
      if(isLoggedIn()){
        var token = getToken();
        
        var payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
       console.log(payload)
        
        return {
          //the line for id, i hope it doesn't fuck shit up
          _id : payload._id,
          email : payload.email,
          name : payload.name,
          role : payload.role
        };
      } else return false;
    };
    
    var currentUserRole = function(){
      return currentUser().role;
    };

    var register = function(user) {
      return $http.post('/api/register', user).success(function(data){
        saveToken(data.token);
      });
    };
    
    var registerPatient = function(user) {
      return $http.post('/api/register-patient', user);
    };
    

    var login = function(user) {
      return $http.post('/api/login', user).success(function(data) {
        saveToken(data.token);
      }).error(function(msg){
        console.log(msg);
      });
    };

    var logout = function() {
      $window.localStorage.removeItem('auth-token');
      $window.location.reload();
    };

    return {
    
      currentUser : currentUser,
      currentUserRole : currentUserRole,
      saveToken : saveToken,
      getToken : getToken,
      isLoggedIn : isLoggedIn,
      register : register,
      registerPatient : registerPatient,
      login : login,
      logout : logout
    };
  }


})();