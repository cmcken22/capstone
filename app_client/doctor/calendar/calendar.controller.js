/*global angular*/
/*global Chart*/
/*global $*/

(function() {
  
  angular.module('mainApp')
  
  .controller('calendarCtrl', calendarCtrl);

  // calendarCtrl.$inject = ['$location', 'dataService', 'ui.calendar', 'ui.bootstrap', 'uiCalendarConfig'];
  calendarCtrl.$inject = ['$compile','$location', 'dataService'];
  
  // function calendarCtrl($compile, calendar, bootstrap, uiCalendarConfig) {
  function calendarCtrl($compile, $location, $dataService) {
      var vm = this;
    
        vm.allExercises = [];
        vm.allPatients = [];
        
        vm.graphDisplayed = false;
        vm.zoom = false;
        
        vm.options = {
            mainGraph: "",
            modalGraph: ""
        }
        
        vm.options.modalGraph = {
            scales: {
                yAxes: [{ scaleLabel: { display: true, labelString: 'Pressure Values' }}],
                xAxes: [{ scaleLabel: { display: true, labelString: 'Time (Seconds)' }}],
             }
        }
        
        vm.options.mainGraph = {
            scales: {
                yAxes: [{ scaleLabel: { display: true, labelString: 'Average Pressure Values' }}],
                xAxes: [{ scaleLabel: { display: true, labelString: 'gameData Objects' }}],
             }
        }
        
        // if($routeParams.param != undefined){
        //     console.log('PARAMS-------');
        //     console.log("hello");
        //     console.log($routeParams.param.patientID);
        //     vm.form.patient = $routeParams.param.patientID;
        //     document.getElementById('patient-select').innerHTML = '<option>'+$routeParams.param.patientID+'</option>';
        // }
        
        vm.modal = {
            title: "",
            details: "",
        }
        
        vm.graphData = {
            storedObjects: [],
            datasets: [],
            labels: [],
            type: 'line',
            datasetIndex: 0,
            index: 0,
        };
        
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
        
        
    
    	$('#calendar').fullCalendar({
    		header: {
    			left: 'prev,next today',
    			center: 'title',
    			right: 'month,basicWeek,basicDay'
    		},
    		
    		defaultDate: '2017-02-12',
    		navLinks: true, // can click day/week names to navigate views
    		editable: true,
    		eventLimit: true, // allow "more" link when too many events
    		events: [
    			{
    				title: 'All Day Event',
    				start: '2017-02-01',
    				url: '',
    				patient: "58a2492c17180e1a95892b86", //john smith
    				exercise: '58a293e70457a8252eead52e', //first exercise - get pumped
    			},
    			{
    				title: 'Long Event',
    				start: '2017-02-07',
    				end: '2017-02-10',
    				url:'https://capstone-test-rfreethy.c9users.io:8080/exercises#range'
    			},
    			{
    				id: 999,
    				title: 'Repeating Event',
    				start: '2017-02-09T16:00:00'
    			},
    			{
    				id: 999,
    				title: 'Repeating Event',
    				start: '2017-02-16T16:00:00'
    			},
    			{
    				title: 'Conference',
    				start: '2017-02-11',
    				end: '2017-02-13'
    			},
    			{
    				title: 'Meeting',
    				start: '2017-02-12T10:30:00',
    				end: '2017-02-12T12:30:00'
    			},
    			{
    				title: 'Lunch',
    				start: '2017-02-12T12:00:00'
    			},
    			{
    				title: 'Meeting',
    				start: '2017-02-12T14:30:00'
    			},
    			{
    				title: 'Happy Hour',
    				start: '2017-02-12T17:30:00'
    			},
    			{
    				title: 'Dinner',
    				start: '2017-02-12T20:00:00'
    			},
    			{
    				title: 'Birthday Party',
    				start: '2017-02-13T07:00:00'
    			},
    			{
    				title: 'Click for Google',
    				url: 'http://google.com/',
    				start: '2017-02-28'
    			}
    		],
    		eventClick: function(event) {
                console.log(event);
                
                $('#myModal').modal('show');
                vm.graph(event);
                
                // vm.updateMainGraph(event);
                if (event.url) {
                    // window.open(event.url);
                    return 0;
                }
            }
    	});
        
        vm.graph = function(event){
          console.log(event.start._d);
          var startDate = new Date(event.start._d);
          startDate.setMinutes(startDate.getTimezoneOffset());
          console.log(startDate);
          
          $dataService.queryDateRange(startDate, startDate, event.patient, event.exercise).success(function(data){
            console.log("DATA RETURNED");
            console.log(data);
            vm.updateMainGraph(data);
          });
        };
        
        vm.updateMainGraph = function(data){
            console.log('---------Updating Chart Data---------');
            console.log(data);
            var color = Chart.helpers.color;
            var oldCanvas = vm.resetCanvas();
            
            var labels = [];
            var graphData = [];
            for(var i=0; i<data[0].pressure.length; i++){
                labels[i] = i;
                graphData[i] = data[0].pressure[i];
            }
            
            var config = {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                      label: "fuck boi",
                      backgroundColor: color(window.chartColors.red).alpha(0.3).rgbString(),
                      borderColor: window.chartColors.red,
                      borderWidth: 1,
                      data: graphData,
                    }]
                },
                //Options are used for labeling the axe
                // options : vm.options.mainGraph
            };
            
            var graph = new Chart(document.getElementById('my-graph').getContext('2d'), config);
            oldCanvas.remove();
            
            console.log('graph created');
        };
        
        vm.resetCanvas = function(){
            var iframe = $('.chartjs-hidden-iframe');
            iframe.remove();
            var oldCanvas = $('#my-graph');
            oldCanvas.removeAttr('id');
            $('#graph').append('<canvas id="my-graph">');
            return oldCanvas;
          };
    
    
    // Search Database for exercises
    
//     vm.createQuery = function(startDate, endDate, exercises){
//     console.log('Creating Query');
//     console.log(vm.form.exercise);
//     var limit = exercises.length;
//     if(vm.form.exercise != undefined && vm.form.exercise != 'ALL'){
//         $dataService.queryDateRange(startDate, endDate, vm.form.patient, vm.form.exercise).success(function(data){
//             if(data.length != 0){
//                 data = vm.sortByDate(data);
//                 vm.graphData.storedObjects[0] = data;
//                 vm.graphData.datasets[0] = vm.graphAVG(data, 0, vm.form.exercise.name);
//             }
//             vm.updateMainGraph();
//         });
//     }
//     else if(vm.form.exercise == undefined || vm.form.exercise == 'ALL'){
//         vm.searchDatabase(startDate, endDate, vm.form.patient, exercises, 0, limit);
//     }
// };

// vm.searchDatabase = function(startDate, endDate, patient, exercises, index, limit){
//     console.log('Searching DataBase');
//     var exId = exercises[index]._id;
//     console.log('Exercise:');
//     console.log(exId);
//     console.log('Patient:');
//     console.log(patient);
//     $dataService.queryDateRange(startDate, endDate, patient, exId).success(function(data){
//         data = vm.sortByDate(data);
//         if(data.length != 0){
//             vm.graphData.storedObjects[index] = data;
//             vm.graphData.datasets[index] = vm.graphAVG(data, index, exercises[index].name);
//         }
//         index++;
//         if(index != limit){
//             vm.searchDatabase(startDate, endDate, patient, exercises, index, limit);
//         }
//         else if(index == limit){
//             console.log('UPDATE NOW');
//             vm.updateMainGraph();
//         }
//     });
// };

// // Search database for events

// vm.createQuery = function(startDate, endDate, exercises){
//     console.log('Creating Query');
//     console.log(vm.form.exercise);
//     var limit = exercises.length;
//     if(vm.form.exercise != undefined && vm.form.exercise != 'ALL'){
//         $dataService.queryDateRange(startDate, endDate, vm.form.patient, vm.form.exercise).success(function(data){
//             if(data.length != 0){
//                 data = vm.sortByDate(data);
//                 vm.graphData.storedObjects[0] = data;
//                 vm.graphData.datasets[0] = vm.graphAVG(data, 0, vm.form.exercise.name);
//             }
//             vm.updateMainGraph();
//         });
//     }
//     else if(vm.form.exercise == undefined || vm.form.exercise == 'ALL'){
//         vm.searchDatabase(startDate, endDate, vm.form.patient, exercises, 0, limit);
//     }
// };

// vm.searchDatabase = function(startDate, endDate, patient, exercises, index, limit){
//     console.log('Searching DataBase');
//     var exId = exercises[index]._id;
//     console.log('Exercise:');
//     console.log(exId);
//     console.log('Patient:');
//     console.log(patient);
//     $dataService.queryDateRange(startDate, endDate, patient, exId).success(function(data){
//         data = vm.sortByDate(data);
//         if(data.length != 0){
//             vm.graphData.storedObjects[index] = data;
//             vm.graphData.datasets[index] = vm.graphAVG(data, index, exercises[index].name);
//         }
//         index++;
//         if(index != limit){
//             vm.searchDatabase(startDate, endDate, patient, exercises, index, limit);
//         }
//         else if(index == limit){
//             console.log('UPDATE NOW');
//             vm.updateMainGraph();
//         }
//     });
// };
    
    
    
}

})();