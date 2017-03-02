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
      $scope.context;
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
      $scope.setGD = function(){
          dataService.getGameDataById($scope.selected).success(function(data){
            $scope.GD =data;
            $scope.showData($scope.GD[0]);
      })
          
      };
      $scope.showData=function(gameD){
          var ctx = $scope.context;
          
          ctx.fillStyle='#FFFFFF'
            ctx.fillRect(50,50,650,400);
            console.log(gameD)
        var dataSize=gameD.pressureAxial.length;
        //var timeInt = $scope.GD.time/dataSize;
        var i=0;
       
        go= $interval(function(){
          //console.log(gameD.pressureAxial[i])
          var h=120 -gameD.pressureAxial[i]/8.3;
           ctx.fillStyle='#7cc9f4'
           ctx.beginPath();
            ctx.arc(800,50,23,Math.PI,1.5*Math.PI,false);
            ctx.arc(950,50,23,1.5*Math.PI,0,false);
            ctx.arc(950,450,23,0,.5*Math.PI,false);
            ctx.arc(800,450,23,.5*Math.PI,Math.PI,false);
            ctx.closePath();
            ctx.fill();
          // ctx.fillStyle = '#FFFFFF'
          // ctx.fillRect(805,55,140,390);
           //ctx.fillRect(10*i,$scope.GD[0].pressure[i],3,3);
        //   if(gameD.canvasY[i] != 0 && gameD.canvasX[i]!=0)
        //   {
            //ctx.beginPath();
            
            //ctx.arc((gameD.canvasX[i]/3.41 )+50,400-(gameD.canvasY[i]/2.92)+50,3, 0, 2 * Math.PI, false);
            ctx.fillStyle ='hsl('+h+',75%,50%)';
            ctx.strokeStyle='hsl('+h+',75%,50%)';
            //console.log(ctx.fillStyle)
            //ctx.fill();
            ctx.lineWidth = 3;
            
            //ctx.closePath();
            if(i>0){
                 var diffX=Math.abs(gameD.canvasX[i]-gameD.canvasX[i+1]);
                var diffY=Math.abs(gameD.canvasY[i]-gameD.canvasY[i+1]);
                console.log(diffX +"vs"+diffY)
                ctx.lineWidth=3;
            if((diffX < 100 && diffX >1) || (diffY<100 && diffY>1)){
                    ctx.beginPath();
                    ctx.moveTo((gameD.canvasX[i]/3.41)+50,400-(gameD.canvasY[i]/2.92)+50);
                    ctx.lineTo((gameD.canvasX[i+1]/3.41)+50,400-(gameD.canvasY[i+1]/2.92)+50);
                    
                    ctx.stroke();
                }
                
            }
           // }
           
            
           
            ctx.beginPath();
            ctx.arc(875,125,gameD.pressureA[i]/7,0,2*Math.PI,false);
            ctx.fillStyle ='#5642f4';
            ctx.fill();
            ctx.closePath();
            
            ctx.beginPath();
            ctx.arc(875,250,gameD.pressureB[i]/7,0,2*Math.PI,false);
            ctx.fillStyle ='#ae3de2';
            ctx.fill();
            ctx.closePath();
            
            ctx.beginPath();
            ctx.arc(875,375,gameD.pressureC[i]/7,0,2*Math.PI,false);
            ctx.fillStyle ='#dd1ab6';
            ctx.fill();
            ctx.closePath();
            ctx.font = "30px Arial";
            ctx.fillStyle='#FFFFFF'
            ctx.textAlign = "center";
ctx.fillText("Thumb",875,100);
ctx.fillText("Index",875,200);
ctx.fillText("Middle",875,325);
           i++;
        }, 20, dataSize);
    
        
      }
      $scope.initFromModal= function(GD){
         
         console.log(GD)
         $scope.showData(GD);
         
      }
      $scope.initCanvas = function(){
         var canvas= document.getElementById('simulation');
           var ctx= canvas.getContext("2d");
           //rounded rectangle
           ctx.strokeStyle='#2FA4E7'
           ctx.fillStyle='#7cc9f4'
           ctx.lineWidth=3;
          
          //trim with rounded corners
          
              ctx.beginPath();
            ctx.arc(25,25,23,Math.PI,1.5*Math.PI,false);
            ctx.arc(975,25,23,1.5*Math.PI,0,false);
            ctx.arc(975,475,23,0,.5*Math.PI,false);
            ctx.arc(25,475,23,.5*Math.PI,Math.PI,false);
            ctx.closePath();
             ctx.stroke();
              ctx.beginPath();
            ctx.arc(800,50,23,Math.PI,1.5*Math.PI,false);
            ctx.arc(950,50,23,1.5*Math.PI,0,false);
            ctx.arc(950,450,23,0,.5*Math.PI,false);
            ctx.arc(800,450,23,.5*Math.PI,Math.PI,false);
            ctx.closePath();
            ctx.fill();
             ctx.stroke();
             ctx.font = "30px Arial";
              ctx.fillStyle='#2FA4E7'
            ctx.textAlign = "center";
    ctx.fillText("Click to start",400,250);
            $scope.context = ctx;
      }
  };

})();

