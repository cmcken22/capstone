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
        templateUrl: 'doctor/dashboard/dashboard.view.html',
        controller: 'homeCtrl',
        controllerAs: 'vm'
      })
      .when('/profile', {
        templateUrl: 'doctor/profile/profile.view.html',
        controller: 'profileCtrl',
        controllerAs: 'vm'
      })
      .when('/patients', {
        templateUrl: 'doctor/patients/patients.view.html',
        controller: 'patientsCtrl',
        controllerAs: 'vm',
        reloadOnSearch: false
      })
      .when('/exercise-manager', {
        templateUrl: 'doctor/event/event.view.html',
        controller: 'eventCtrl',
        controllerAs: 'vm',
        reloadOnSearch: false
      })
      .when('/manager', {
        templateUrl: 'doctor/manager/manager.view.html',
        controller: 'managerCtrl',
        controllerAs: 'vm',
      })
      .when('/messages', {
        templateUrl: 'doctor/messages/messages.view.html',
        controller: 'messagesCtrl',
        controllerAs: 'vm',
        reloadOnSearch: false
      })
      .when('/calendar', {
        templateUrl: 'doctor/calendar/calendar.view.html',
        controller: 'calendarCtrl',
        controllerAs: 'vm',
      })
      .when('/exercises', {
        templateUrl: 'doctor/exercises/exercises.view.html',
        controller: 'exercisesCtrl',
        controllerAs: 'vm',
        reloadOnSearch: false
      })
      .when('/simulation',{
        templateUrl: 'doctor/sim/sim.view.html',
        controller: 'simCtrl'
        
      })
      .when('/doctor', { 
        redirectTo: '/dashboard'
      })
      .otherwise({redirectTo: '/dashboard'});

    // // use the HTML5 History API
     $locationProvider.html5Mode(true);
  }
  
  function run($rootScope, $location, authentication, $http) {
    $http.defaults.headers.common.Authorization = "Bearer " + authentication.getToken();
    // $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
    //   if (!authentication.isLoggedIn()) {
    //     window.location = '/login';
    //   }
    // });
    
  }
  
  angular
    .module('mainApp')
    .config(['$routeProvider', '$locationProvider', config])
    .run(['$rootScope', '$location', 'authentication','$http', run]);

})();