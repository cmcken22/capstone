/*global moment*/
/*global angular*/
/*global Chart*/
/*global $*/

(function() {
  
  angular.module('mainApp')
  .controller('simCtrl', simCtrl);

  simCtrl.$inject = ['$scope','$interval', 'dataService','authentication'];
  
  
  function simCtrl($scope, $interval, dataService,authentication) {
      var vm = this;
      
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
      
      $scope.getGameData= function() {
          dataService.queryDateRange($scope.sDate,$scope.eDate,$scope.patient,$scope.exercise).success(function(data){
              console.log(data);
              $scope.gameDatas = data; 
          });
      };
      
      $scope.setGD = function(){
          dataService.getGameDataById($scope.selected).success(function(data){
              $scope.GD = data;
              $scope.showData($scope.GD[0]);
          });
      };
      
      //------------------------------------------------------------------------
      var color = Chart.helpers.color;
      vm.colors = [];
      vm.colors[0] = {
          light: color(window.chartColors.red).alpha(0.3).rgbString(),
          dark: window.chartColors.red,
          
      };
      vm.colors[1] = {
          light: color(window.chartColors.blue).alpha(0.3).rgbString(),
          dark: window.chartColors.blue,
          
      };
      vm.colors[2] = {
          light: color(window.chartColors.green).alpha(0.3).rgbString(),
          dark: window.chartColors.green,
          
      };
      vm.colors[3] = {
          light: color(window.chartColors.purple).alpha(0.3).rgbString(),
          dark: window.chartColors.purple,
          
      };
      vm.colors[4] = {
          light: color(window.chartColors.orange).alpha(0.3).rgbString(),
          dark: window.chartColors.orange,
      };
      
      var graphData = {
          labels: [],
          pressureAxial: [],
          pressureA: [],
          pressureB: [],
          pressureC: [],
      };
      var graphLabels = [];
      var rtGraph = null;
      var ts = 0;
      
      var initGraph = function(){
          console.log('Create Modal Graph');
          for(var i=0; i<graphData.pressureAxial.length; i++){
              if(i%50 == 0) graphData.labels[i] = ts++;
              else graphData.labels[i] = '';
          }
            // console.log(modalGraph.data.datasets[0]);
            var config = {
                type: 'line',
                data: {
                    labels: graphData.labels,
                    datasets: [{
                        // labels: 'data',
                        backgroundColor: vm.colors[0%vm.colors.length].light,
                        borderColor: vm.colors[0%vm.colors.length].dark,
                        borderWidth: 1,
                        data: [],
                    }],
                },
                options : { 
                    scales: {
                        yAxes: [{ scaleLabel: { display: true, labelString: 'yAxes' }, ticks: { beginAtZero: true }}],
                        xAxes: [{ scaleLabel: { display: true, labelString: 'xAxes' }, ticks: { autoSkip: false } }],
                    },
                }
            }
            // rtGraph = new Chart(document.getElementById('my-modalGraph-2').getContext('2d'), config);
      }
      //------------------------------------------------------------------------
      
      $scope.showData = function(gameD){
          //--------------------------------------------------------------------
          graphData.pressureAxial = gameD.pressureAxial;
          console.log(graphData.pressureAxial);
          initGraph();
          //--------------------------------------------------------------------
        //   /*
          var ctx = $scope.context;
          ctx.fillStyle='#FFFFFF'
          ctx.fillRect(50,50,650,400);
          console.log('Showing Game Data');
          console.log(ctx);
          console.log(gameD);
          var dataSize = gameD.pressureAxial.length;
          
          var i=0;
          
          var radiusA = gameD.pressureA[0]/7;
          var radiusB = gameD.pressureB[0]/7;
          var radiusC = gameD.pressureC[0]/7;
          
          go = $interval(function(){
              //console.log(gameD.pressureAxial[i]);
              var h = 120 - gameD.pressureAxial[i]/8.3;
              ctx.fillStyle='#7cc9f4'
              ctx.beginPath();
              ctx.arc(800,50,23,Math.PI,1.5*Math.PI,false);
              ctx.arc(950,50,23,1.5*Math.PI,0,false);
              ctx.arc(950,450,23,0,.5*Math.PI,false);
              ctx.arc(800,450,23,.5*Math.PI,Math.PI,false);
              ctx.closePath();
              ctx.fill();
                
              ctx.fillStyle ='hsl('+h+',75%,50%)';
              ctx.strokeStyle='hsl('+h+',75%,50%)';
              ctx.lineWidth = 3;
            
              if(i>0){
                  var diffX=Math.abs(gameD.canvasX[i]-gameD.canvasX[i+1]);
                  var diffY=Math.abs(gameD.canvasY[i]-gameD.canvasY[i+1]);
                  console.log(diffX + " vs " + diffY);
                  ctx.lineWidth = 3;
                
                  if((diffX < 50 && diffX >1) || (diffY<50 && diffY>1)){
                      ctx.beginPath();
                      ctx.moveTo((gameD.canvasX[i]/3.41)+50,400-(gameD.canvasY[i]/2.92)+50);
                      ctx.lineTo((gameD.canvasX[i+1]/3.41)+50,400-(gameD.canvasY[i+1]/2.92)+50);
                      ctx.stroke();
                  }
              }
            
              if(i>0){
                  radiusA = radiusA*(.90)+ (.1)*gameD.pressureA[i+1]/7;
                  radiusB = radiusB*(.90)+ (.1)*gameD.pressureB[i+1]/7;
                  radiusC = radiusC*(.90)+ (.1)*gameD.pressureC[i+1]/7;
              }
            
              ctx.beginPath();
              ctx.arc(875,125,radiusA,0,2*Math.PI,false);
              ctx.fillStyle ='#5642f4';
              ctx.fill();
              ctx.closePath();
            
              ctx.beginPath();
              ctx.arc(875,250,radiusB,0,2*Math.PI,false);
              ctx.fillStyle ='#ae3de2';
              ctx.fill();
              ctx.closePath();
            
              ctx.beginPath();
              ctx.arc(875,375,radiusC,0,2*Math.PI,false);
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
          } , 20, dataSize);
        //   */
          
      };
      
      $scope.initFromModal= function(GD){
         console.log('INIT FROM MODAL');
        //  console.log(GD)
         $scope.showData(GD);
         
      };
      
      $scope.initCanvas = function(){
        var canvas= document.getElementById('simulation');
        var ctx= canvas.getContext("2d");
        //rounded rectangle
        ctx.strokeStyle='#2FA4E7'
        ctx.fillStyle='#7cc9f4'
        ctx.lineWidth=3;
        
        //trim with rounded corners
        ctx.fillStyle='#FFFFFF'
        ctx.fillRect(50,50,650,400);
        
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

