/*global angular*/
/*global Chart*/
/*global $*/

(function() {
  
  angular
    .module('mainApp')
    .controller('homeCtrl', homeCtrl);
    
    homeCtrl.$inject = ['$scope','authentication','dataService'];
    
    function homeCtrl ($scope, authentication, dataService) {
        menuInit();
        
        $scope.myEvents=[];
        $scope.today =new Date();
        $scope.allex =[];
        $scope.mssg=[];
        $scope.myGameData=[];
        $scope.doctorName;
        $scope.thisUserId= authentication.currentUser()._id;
        
        $scope.getTime = function(data){
          var newdate = new Date(data)
          var minutes =newdate.getMinutes();
          if(minutes == 0)
          {
            minutes ='00';
          }
          return (newdate.getHours() +":"+ minutes);
        }
        $scope.getExercise = function(){
          dataService.getExercise().success(function(data){
            $scope.allex=data;
            console.log($scope.allex);
            $scope.myEvents.forEach(function(event)
            {
              $scope.allex.forEach(function(ex)
              {
                if(event.exercise == ex._id)
                {
                  event.exercise = ex
                }
              })
            })
          })
        }
        
        $scope.getData=function(){
          
          //console.log(authentication.currentUser()._id)
          dataService.getEventByPatientId($scope.thisUserId).success(function(data){
            console.log(data);
          
              data.forEach(function(data){
                //console.log(data.date)
                //console.log($scope.today)
                compareDate = new Date((data.date))
                //console.log(compareDate);
                if($scope.today.toDateString() == compareDate.toDateString())
                {
                  $scope.myEvents.push(data);
                  console.log(data._id);
                  $scope.allex.push(data.exercise);
                }
              });
              $scope.getExercise();
                $scope.getMessages();
                $scope.getGameData();
                dataService.getDoctor().success(function(data){
        $scope.doctorName = data.name;
      })
            console.log($scope.myEvents);
          });
        };
        $scope.getGameData = function(){
          dataService.getGameDataForPatient(authentication.currentUser()._id).then(function(data)
          {
            
            console.log($scope.myGameData)
          data.data.sort(comp);
          for(var i=0; i<10; i++)
          {
            $scope.myGameData[i]=data.data[i];
            $scope.myGameData[i].date=new Date(data.data[i].date)
          }
           $scope.myGameData.forEach(function(exercise)
            {
              $scope.allex.forEach(function(ex)
              {
                if(exercise.exercise == ex._id)
                {
                  exercise.exercise = ex;
                }
              })
            })
          
          })
           
        }
        function comp(a, b) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
}


        $scope.getMessages = function(){
          dataService.getMessages().then(function(data){
            $scope.mssg=data.data;
            console.log($scope.mssg)
          })
          
        }
    }
})();   

function menuInit(){
  $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
  });
}
