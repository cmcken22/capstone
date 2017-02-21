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
        
        $scope.myEvents='';
        $scope.today = new Date();
        $scope.thisUserId= authentication.currentUser()._id;
        $scope.getEvents=function(){
          
          //console.log(authentication.currentUser()._id)
          dataService.getEventByPatientId($scope.thisUserId).success(function(data){
            console.log(data)
            // console.log($scope.today +"vs " + data[0].date)
            // for(var i=0; i<data.length; i++)
            // {
              
            //   if($scope.today==data[i].date)
            //   {
                
                $scope.myEvents += data[i];
            //   }
            // }
            
            
            console.log($scope.myEvents);
          });
        };
    }
})();   

function menuInit(){
  $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
  });
}
