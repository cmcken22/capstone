/*global $*/
(function() {

  angular
    .module('mainApp')
    .controller('eventCtrl', eventCtrl)
   
  eventCtrl.$inject = ['$scope', 'dataService','authentication'];
  
  function eventCtrl($scope, dataService, authentication) {
      //user,exercise, appointment, date/time
      //repetition/
    console.log(authentication.currentUser());
      
      $scope.sInfo = {
      patient: "",
      doctor: authentication.currentUser()._id,
      exercise:"",
      type: null,
      date:"",
      endTime:'',
      gameData:null,
      completed:false,
      skip:'1',
      rOption:'',
      repeat:null,
      dateFinish:''
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
      //$scope.rOption='';//repeat option
      //$scope.skip='1';//every X number of days
      $scope.skipwhat='';
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

      });;
      
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
      });;
      
      $("#patient-select").select2({
        		  //data: $scope.sInfo.patient,
        		  placeholder: "Select a patient"
        		});
        		$("#patient-select").on("change", function() {
                $scope.sInfo.patient = $("#patient-select").val();
            });
        		$("#exercise-select").select2({
        		 // data: $scope.sInfo.exercise,
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

        console.log(data);
        $scope.allex = data;
      });
    };
   
    $scope.getPatients = function(){
      console.log('sup dude');
      dataService.getPatients().then(function(res)
      {
        //so far this is useless because there are no patients
        //so it should return the current user hopeful
        
        $scope.patients = res.data;
        
      });
    };
   
    $scope.addEvent = function() {
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
      //$scope.sInfo.dateFinish = $scope.sInfo.toJSO
      console.log($scope.sInfo.date);
      console.log($scope.sInfo.endTime);
      console.log("adding event (hopefully)")
      console.log($scope.sInfo);
         
        dataService.postEvent($scope.sInfo).success(function(data){
          console.log(data)
        }).error(function(err) {
          alert(err);
        });
    
       
    };
  
     
     
  }
  
})();