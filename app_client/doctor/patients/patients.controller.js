/*global angular*/

(function() {
  
  angular.module('mainApp')
  .controller('patientsCtrl', patientsCtrl);

  patientsCtrl.$inject = ['$location', 'dataService','authentication', '$scope', '$routeParams'];
  
  
  function patientsCtrl($location, dataService, authentication, $scope, $routeParams) {
    var vm = this;
    
    vm.patients;
    vm.getPatients = function(){
      dataService.getPatients().success(function(data) {
          vm.patients = data;
      })
      .error(function (e) {
        console.log(e);
      });
    }
    vm.getPatients();
  
    vm.registerCredentials = {
      name : "",
      email : "",
      password : "",
      regDoctor: authentication.currentUser()._id
    };
    
    vm.registerSubmit = function(){
      authentication.registerPatient(vm.registerCredentials).success(function(data){
        vm.registerCredentials.name = "";
        vm.registerCredentials.email = "";
        vm.registerCredentials.password = "";
        jQuery('#add .alert-div').html('<div class="alert alert-dismissible alert-success"><button type="button" class="close" data-dismiss="alert">&times;</button>Patient account has successfully been created.</div>');
        
      }).error(function(err){
        jQuery('#add .alert-div').html('<div class="alert alert-dismissible alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button>User email already in use.</div>');
      });
    };
    
    vm.pastMessages = [];
    vm.getPastMessages = function(patientID){
      // console.log('Getting Past Messages');
      // dataService.doctorGetMessages().success(function(data){
      //   // console.log("vm.pastMessages");
      //   console.log(data);
      //   vm.pastMessages = data;
      //   console.log(vm.pastMessages);
      //   // $scope.$apply();
      // });
    };
    
    vm.viewData = function(patientID){
      console.log('PatientID: ');
      console.log(patientID);
      var param = {
        patientID: patientID
      };
      $location.path('/exercises').search({param: param});
    };
    
    vm.manageExercises = function(patientID){
      console.log('PatientID: ');
      console.log(patientID);
      var param = {
        patientID: patientID
      };
      $location.path('/exercise-manager').search({param: param});
    };
    
    vm.messageSend = function(patientId){
      var messageData = {
        patientId : patientId,
        messageSubject : vm.messageSubject,
        messageBody : vm.messageBody
      }
      
      dataService.doctorPostMessage(messageData).success(function(data){
        vm.messageSubject = "";
        vm.messageBody = "";
        jQuery('#view .alert-div').html('<div class="alert alert-dismissible alert-success"><button type="button" class="close" data-dismiss="alert">&times;</button>Your message has successfully been sent.</div>');
      }).error(function(){
        jQuery('#view .alert-div').html('<div class="alert alert-dismissible alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button>There was an error sending your message.</div>');
      })
    };
    
    vm.togglePatient = function(patientId){
      var selector = '#' + patientId + ' .toggle-section';
       jQuery(selector).toggleClass('toggled');
    };
  }

})();
