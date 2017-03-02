/*global angular*/
/*global Chart*/
/*global $*/

(function() {
  
  angular
    .module('mainApp')
    .controller('homeCtrl', homeCtrl);
    
    homeCtrl.$inject = ['$scope','authentication','dataService'];
    
    function homeCtrl ($scope, authentication, dataService) {
        var vm = this;
        vm.pastExerciseCount = 0;  
        vm.unreadCount = 0;
        
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
            //console.log($scope.allex);
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
        
        $scope.getData = function(){
          
          //console.log(authentication.currentUser()._id)
          dataService.getEventByPatientId($scope.thisUserId).success(function(data){
            //console.log(data);
          
              data.forEach(function(data){
                //console.log(data.date)
                //console.log($scope.today)
                var compareDate = new Date((data.date))
                //console.log(compareDate);
                if($scope.today.toDateString() == compareDate.toDateString())
                {
                  $scope.myEvents.push(data);
                  //console.log(data._id);
                  $scope.allex.push(data.exercise);
                }
              });
              $scope.getExercise();
                $scope.getMessages();
                $scope.getGameData();
              dataService.getDoctor().success(function(data){
                $scope.doctorName = data.name;
              })
            //console.log($scope.myEvents);
          });
        };
        
        $scope.getGameData = function(){
          dataService.getGameDataForPatient(authentication.currentUser()._id).then(function(data){
          vm.pastExerciseCount = 0
          data.data.sort(comp);
          for(var i=0; i<10; i++){
            vm.pastExerciseCount++;
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
            vm.parseMessageData()
          })
          
        }
        
        
        
        //Robs stuff
        
        
       
        vm.dateString = function(date){
          var date = new Date(date);
          return date.toDateString() +', '+ date.toLocaleTimeString()
        };
        
        vm.parseMessageData = function(){
          var unreadCount = 0;

          $scope.mssg.forEach(function(message){
            if(message.receiver == $scope.thisUserId){
              if(message.read == false){
                unreadCount++;
              }
            }
          });
          vm.unreadCount = unreadCount;
        }
        
        vm.activeReply;
        vm.replyClick = function(message){
          
          vm.activeReply = message;
          console.log(message);
          dataService.getReplys(message._id).success(function(data){
            vm.activeReply.replysData = data;
          })
        }
       vm.currentUser=authentication.currentUser();
        vm.replySenderName = function(replySender){
          if(replySender == vm.currentUser._id) return vm.currentUser.name;
          else return $scope.doctorName;
        }
        vm.postReply = function(){
        var replyData = {
          body:vm.replyBody,
          message:vm.activeReply._id
        }
        dataService.postReply(replyData).success(function(data){
          vm.replyBody = "";
          vm.replyClick(vm.activeReply)//get the replys again
          jQuery('#reply-modal .alert-div').html('<div class="alert alert-dismissible alert-success"><button type="button" class="close" data-dismiss="alert">&times;</button>Your reply has successfully been sent.</div>');
        })
        .error(function(){
          jQuery('#reply-modal .alert-div').html('<div class="alert alert-dismissible alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button>There was an error sending your reply.</div>');
        })
      }
       
        //end rob
        $scope.getData();
        
        
    }
})();   
