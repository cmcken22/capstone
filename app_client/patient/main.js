/*global angular*/
(function () {

   angular.module('mainApp', ['ngRoute']);
  
  function config ($routeProvider, $locationProvider) {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(function(err) {
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
    
    
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'patient/dashboard/dashboard.view.html',
        controller: 'homeCtrl',
        controllerAs: 'vm'
      })
      .when('/patient', { 
        redirectTo: '/dashboard'
      })
      
      .when('/messages', {
        templateUrl: 'patient/messages/messages.view.html',
        controller: 'messagesCtrl',
        controllerAs: 'vm',
        reloadOnSearch: false
      })
      .when('/calendar', {
        templateUrl: 'patient/calendar/calendar.view.html',
        controller: 'calendarCtrl',
        controllerAs: 'vm',
      })
      .when('/exercises', {
        templateUrl: 'patient/exercises/exercises.view.html',
        controller: 'exercisesCtrl',
        controllerAs: 'vm',
        reloadOnSearch: false
      })
      .when('/profile', {
        templateUrl: 'patient/profile/profile.view.html',
        controller: 'profileCtrl',
        controllerAs: 'vm'
      })
      .otherwise({redirectTo: '/dashboard'});

    // // use the HTML5 History API
     $locationProvider.html5Mode(true);
  }
  
  function run($rootScope, $location, authentication,$http) {
    $http.defaults.headers.common.Authorization = "Bearer " + authentication.getToken();
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
      if (!authentication.isLoggedIn()) {
        window.location = '/login';
      }
    });
    
  }
  
  angular
    .module('mainApp')
    .config(['$routeProvider', '$locationProvider', config])
    .run(['$rootScope', '$location', 'authentication','$http', run]);

})();