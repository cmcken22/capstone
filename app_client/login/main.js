/*global angular*/
(function () {

  angular.module('mainApp', ['ngRoute']);

  function config ($routeProvider, $locationProvider) {
    
    $routeProvider
      .when('/login', {
        templateUrl: 'login/login.view.html',
        controller: 'loginCtrl',
        controllerAs: 'vm'
      })
      .otherwise({redirectTo: '/login'});

    // // use the HTML5 History API
     $locationProvider.html5Mode(true);
  }

  function run($http,$rootScope, $location, authentication) {
    $http.defaults.headers.common.Authorization = "Bearer " + authentication.getToken();
    if (authentication.isLoggedIn()) {
      if(authentication.currentUserRole() == 'patient')
        window.location = '/patient';
      if(authentication.currentUserRole() == 'doctor')
        window.location = '/doctor';
    }
  }
  
  angular
    .module('mainApp')
    .config(['$routeProvider', '$locationProvider', config])
    .run(['$http','$rootScope', '$location', 'authentication', run]);

})();