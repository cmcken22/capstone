(function () {

  angular
  .module('mainApp')
  .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$location', 'authentication'];
  function loginCtrl($location, authentication) {
    var vm = this;
    vm.isRegister = false;
    vm.loginCredentials = {
      email : "",
      password : ""
    };
    
    vm.registerCredentials = {
      name : "",
      email : "",
      password : "",
      role: ""
    };

    vm.loginSubmit = function () {
      authentication
        .login(vm.loginCredentials)
        .error(function(err){
          alert(err.message);
        })
        .then(function(){
          if(authentication.currentUserRole() == 'patient')
            window.location = 'patient';
          if(authentication.currentUserRole() == 'doctor')
            window.location = 'doctor';
        });
    };
    
    vm.registerSubmit = function () {
      console.log('Submitting registration');
      authentication
        .register(vm.registerCredentials)
        .error(function(err){
          alert(err.message);
        })
        .then(function(){
          if(authentication.currentUserRole() == 'patient')
            window.location = 'patient';
          if(authentication.currentUserRole() == 'doctor')
            window.location = 'doctor';
        });
    };
    
    vm.toggleRegister = function(){
      if (vm.isRegister === true) {vm.isRegister=false;}
      else {vm.isRegister=true;}
    }
  }
  

})();