(function() {
  
  angular.module('mainApp')
  .controller('simCtrl', simCtrl);

  simCtrl.$inject = ['$scope','$interval', 'dataService','authentication'];
  
  
  function simCtrl($scope, $interval, dataService,authentication) {
      
      $scope.gameDatas='';
      $scope.sDate='';
      $scope.eDate='';
      $scope.selected='';
      $scope.GD='';
      $scope.allex;
      $scope.allPatients;
      $scope.exercise;
      $scope.patient
      var go;
      //need to get gamedatas based on : patient, date, exercise
      
      $('.edate').datepicker({
          format: 'yyyy-mm-dd'
      }).on("changeDate", function() {
          $scope.eDate = moment($(this).val(),'YYYY-MM-DD');
          $scope.eDate=$scope.eDate.toJSON();
      });;
      $('.sdate').datepicker({
          format: 'yyyy-mm-dd'
      }).on("changeDate", function() {
          $scope.sDate = moment($(this).val(),'YYYY-MM-DD');
          $scope.sDate=$scope.sDate.toJSON();
      });;
      $scope.getData= function(){
          dataService.getPatients().success(function(data){
              $scope.allPatients=data;
              
          });
          dataService.getExercise().success(function(data){
              $scope.allex=data
          });
      
          
      };
      $scope.getGameData= function()
      {
          dataService.queryDateRange($scope.sDate,$scope.eDate,$scope.patient,$scope.exercise)
          .success(function(data){$scope.gameDatas=data; console.log(data)})
      }
      $scope.showData=function(){
          console.log($scope.selected)
          dataService.getGameDataById($scope.selected).success(function(data){
            $scope.GD =data;
            
            console.log($scope.GD[0])
        var dataSize=$scope.GD[0].pressure.length;
        var timeInt = $scope.GD.time/dataSize;
        var i=0;
        var canvas= document.getElementById('simulation');
           var ctx= canvas.getContext("2d");
        go= $interval(function(){
          
          var h=$scope.GD[0].pressure[i]*5;
          var color= 'hsl('+h+',75%,100%)'
        console.log(color);
           //ctx.fillRect(10*i,$scope.GD[0].pressure[i],3,3);
            ctx.beginPath();
            ctx.arc(3*i, 3*i,5, 0, 2 * Math.PI, false);
            ctx.fillStyle ='hsl('+h+',75%,50%)';
            console.log(ctx.fillStyle)
            ctx.fill();
            ctx.lineWidth = 1;
            
            ctx.closePath();
           i++;
        }, 1000, dataSize);
        });
        
      }
  };

})();