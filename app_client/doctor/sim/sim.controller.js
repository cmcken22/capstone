(function() {
  
  angular.module('mainApp')
  .controller('simCtrl', simCtrl);

  simCtrl.$inject = ['$scope', 'dataService','authentication'];
  
  
  function simCtrl($scope, dataService) {
      
      $scope.gameDatas='';
      $scope.selected='';
      $scope.getGameData= function(){
       dataService.getGameData().success(function(data) {

        console.log(data);
        $scope.gameDatas = data;
        
        
      });}
      $scope.showData=function(){
          console.log($scope.selected)
      }
  };

})();