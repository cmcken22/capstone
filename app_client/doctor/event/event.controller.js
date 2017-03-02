/*global $*/
(function() {

  angular
    .module('mainApp')
    .controller('eventCtrl', eventCtrl)
   
  eventCtrl.$inject = ['$scope', 'dataService','authentication', '$routeParams'];
  
  function eventCtrl($scope, dataService, authentication, $routeParams) {
      //user,exercise, appointment, date/time
      //repetition/
    // console.log(authentication.currentUser());
      
      $scope.sInfo = {
        patient: null,
        doctor: authentication.currentUser()._id,
        exercise:null,
        description:'',
        rOption: 'days',
        skip: 1,
        type: false,
        date:"",
        endTime:'',
        gameData:null,
        completed:false,
        repeat:false,
        dateFinish:'',
        timeLimit:'',
        alphaFilter:'',
        gripThreshold: '',
        axialThreshold:'' 
      }
      //YYYY-MM-DD
      $scope.date
      $scope.startTime='';
      $scope.endTime ='';
      $scope.endDate='';
      //holds the momentjs object of time: 
      $scope.mom='';
      $scope.end='';
     
      $scope.allex = {};//allexercises
      $scope.patients= {};//allpatients
      //repeating events stuff here
      //$scope.repeat=false;
      //$scope.endDate='';//do the repetition until this date
    
      //++++++++++++++++++++++++++++++++++
      //          The jQuery
      //++++++++++++++++++++++++++++++++++
      $('.datetime').datepicker({
          format: 'yyyy-mm-dd'
      }).on("changeDate", function() {
          $scope.date = $(this).val(); //for some reason the picker itself doesn't actually count as text in the text box. go figure
          console.log($(this).val())

      });;
      
      $('.endDate').datepicker({
          format: 'yyyy-mm-dd'
      }).on("changeDate", function() {
          $scope.endDate = moment($(this).val(),'YYYY-MM-DD');
          $scope.sInfo.dateFinish= $scope.endDate.toJSON();//for some reason the picker itself doesn't actually count as text in the text box. go figure
          console.log('repeating until ' + $scope.endDate);
      });
      
      $('#starttimepick').timepicker({
          'timeFormat': 'H:i',
          'scrollDefault': '06:00'
      }).on('changeTime', function() {
          $scope.startTime = $(this).val();
          //console.log($(this).val())

      });;

      $('#endtimepick').timepicker({
          'timeFormat': 'H:i',
          //'disableTimeRanges': [['0:0', $scope.startTime]],
          //'minTime':$('#starttimepick').val()
      }).on('changeTime', function() {
          $scope.endTime = $(this).val();
      });
      
  		$("#exercise-select").select2({
  		  placeholder: "Select an exercise"
  		});
  		$("#exercise-select").on("change", function() {
          $scope.sInfo.exercise = $("#exercise-select").val();
      });

      (function() {
         
          for (var i = 1; i <= 30; i++) {
            $(".1-100").append($('<option></option>').val(i).html(i))
          }
          
      })();
      
      
    $scope.getExercise = function() {
      
      dataService.getExercise().success(function(data) {
        $scope.allex = data;
      });
    };
    
    
    $scope.getPatients = function(){
      dataService.getPatients().success(function(data){
        $scope.patients = data;
      });
    };
    var vm = this;
    vm.addEvent = function() {
        //making the date into a moment 
      $scope.startTime= $scope.startTime.split(':');
      $scope.endTime=$scope.endTime.split(':');
      $scope.mom = moment($scope.date,"YYYY-MM-DD");
      $scope.mom.set('hour',$scope.startTime[0]);
      $scope.mom.set('minute',$scope.startTime[1])
      $scope.end = moment($scope.date,"YYYY-MM-DD");
      $scope.end.set('hour',$scope.endTime[0]);
      $scope.end.set('minute',$scope.endTime[1]);
      $scope.sInfo.date = $scope.mom.toJSON();
      $scope.sInfo.endTime =$scope.end.toJSON();
      
      dataService.postEvent($scope.sInfo).success(function(data){
        jQuery('#new-event .alert-div').html('<div class="alert alert-dismissible alert-success"><button type="button" class="close" data-dismiss="alert">&times;</button>The event was successfully saved.</div>');
      }).error(function(err) {
        jQuery('#new-event .alert-div').html('<div class="alert alert-dismissible alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button>There was an error saving the event.</div>');
      });
    };
    vm.exerciseInfo = {
      name : '',
      description : ''
    }
    vm.addExercise = function(){
      dataService.postExercise(vm.exerciseInfo).success(function(data){
        console.log(data)
      })
      .success(function(data){
        vm.exerciseInfo.name = '';
        vm.exerciseInfo.description = '';
        jQuery('#new-exercise .alert-div').html('<div class="alert alert-dismissible alert-success"><button type="button" class="close" data-dismiss="alert">&times;</button>Your exercise was successfully saved.</div>');
      })
      .error(function(err) {
        jQuery('#new-exercise .alert-div').html('<div class="alert alert-dismissible alert-success"><button type="button" class="close" data-dismiss="alert">&times;</button>There was an error saving the exercise.</div>');
      });
    }
    $scope.getPatients();
    $scope.getExercise();
    
    $("#patient-select").select2({
  		  data: $scope.patients,
  		  placeholder: "Select a patient"
  		});
  		$("#patient-select").on("change", function() {
          $scope.sInfo.patient = $("#patient-select").val();
      });
     
    if($routeParams.param != undefined){
        console.log('PARAMS-------');
        console.log($routeParams.param.patientID);
        $scope.patient = $routeParams.param.patientID;
        // vm.form.patient = $routeParams.param.patientID;
        document.getElementById('patient-select').innerHTML = '<option>'+$routeParams.param.patientID+'</option>';
        console.log(document.getElementById('patient-select').innerHTML);
      }
  
  }
  
})();