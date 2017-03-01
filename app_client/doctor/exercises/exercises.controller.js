/*global angular*/
/*global Chart*/
/*global $*/
/*global moment*/

(function() {
  
  angular
    .module('mainApp')
    .controller('exercisesCtrl', graphDataCtrl);
    
    graphDataCtrl.$inject = ['dataService', '$scope', '$routeParams'];
    
    function graphDataCtrl ($dataService, $scope, $routeParams) {
        var vm = this;
        
        vm.allExercises = [];
        vm.allPatients = [];
        vm.originalObject = null;
        vm.graphDisplayed = false;
        vm.zoom = false;
        vm.showSim = false;
        
        vm.options = {
            mainGraph: "",
            modalGraph: ""
        }
        
        vm.options.mainGraph = {
            scales: {
                yAxes: [{ scaleLabel: { display: true, labelString: 'Average Pressure Values' }}],
                xAxes: [{ scaleLabel: { display: true, labelString: 'gameData Objects' }}],
             }
        }
        
        vm.options.modalGraph = {
            scales: {
                yAxes: [{ scaleLabel: { display: true, labelString: 'Pressure Values' }}],
                xAxes: [{ scaleLabel: { display: true, labelString: 'Time (Seconds)' }, ticks: { autoSkip: false } }],
             }
        }
        
        vm.currentDate = {
            date: '',
            day: '',
            month: '',
            year: '',
            string: ''
        }
        
        vm.nextDate = {
            date: '',
            day: '',
            month: '',
            year: '',
            string: '',  
        }
        
        vm.setFormDate = function(){
            vm.currentDate.date = new Date();
            vm.currentDate.date.setHours(0,0,0,0);
            console.log('CURRENT DATE: ' + vm.currentDate.date);
            vm.currentDate.day      = vm.currentDate.date.getUTCDate();
            vm.currentDate.month    = vm.currentDate.date.getUTCMonth()+1;
            vm.currentDate.year     = vm.currentDate.date.getFullYear();
            vm.currentDate.string   = vm.currentDate.month + '-' + vm.currentDate.day + '-' + vm.currentDate.year;  
            console.log('CURRENT DATE STRING: ' + vm.currentDate.string);
            
            vm.nextDate.date = new Date();
            vm.nextDate.date.setHours(0,0,0,0);
            vm.nextDate.date.setDate(vm.nextDate.date.getDate() + 7);
            console.log('NEXT DATE: ' + vm.nextDate.date);
            vm.nextDate.day = vm.nextDate.date.getUTCDate();
            vm.nextDate.month = vm.nextDate.date.getUTCMonth()+1;
            vm.nextDate.year = vm.nextDate.date.getFullYear();
            vm.nextDate.string = vm.nextDate.month + '-' + vm.nextDate.day + '-' + vm.nextDate.year;
            console.log('NEXT DATE STRING: ' + vm.nextDate.string);
        };
        vm.setFormDate();
        
        vm.form = {
            date : "",
            month : vm.currentDate.month + "/" + vm.currentDate.year,
            exercise : "ALL",
            patient: null,
            startDate : vm.currentDate.string,  //todays date
            endDate : vm.nextDate.string,       //a week from today
        }
        
        if($routeParams.param != undefined){
            console.log('PARAMS-------');
            // console.log($routeParams.param.patientID);
            vm.form.patient = $routeParams.param.patientID;
            document.getElementById('patient-select').innerHTML = '<option>'+$routeParams.param.patientID+'</option>';
        }
        
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
        }
        
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
        
        $('#graphArea').hide();
        
        vm.initInputFields = function(){
            vm.patientNames = [];
            $dataService.getPatients().success(function(data){
                vm.patientNames = data.map(function(a) {
                  return { id:a._id, text:a.name }
                });
                $("#patient-select").select2({
        		  data: vm.patientNames,
        		  placeholder: "Select a patient"
        		});
        		$("#patient-select-range").select2({
        		  data: vm.patientNames,
        		  placeholder: "Select a patient"
        		});
            });
            $("#patient-select").on("change", function() {
                vm.form.patient = $("#patient-select").val();
            });
            $("#patient-select-range").on("change", function() {
                vm.form.patient = $("#patient-select-range").val();
            });
            
            vm.exerciseNames = [];
            $dataService.getExercise().success(function(data){
                vm.allExercises = data;
                vm.exerciseNames = data.map(function(a) {
                  return { id:a._id, text:a.name }
                });
                $("#exercise-select").select2({
        		  data: vm.exerciseNames,
        		  placeholder: "Select an Exercise"
        		});
        		$("#exercise-select-range").select2({
        		  data: vm.exerciseNames,
        		  placeholder: "Select an Exercise"
        		});
            });
            $("#exercise-select").on("change", function() {
                vm.form.exercise = $("#exercise-select").val();
            });
            $("#exercise-select-range").on("change", function() {
                vm.form.exercise = $("#exercise-select-range").val();
            });
        };
        
        vm.initDatePickers = function(){
            $('#monthPicker').datepicker({
                format: "mm/yyyy",
                viewMode: "months", 
                minViewMode: "months",
                orientation: 'bottom',
                autoclose: true,
            }).on("changeDate", function() {
                vm.form.month = $("#_monthPicker").val();
            });
            $('#monthPicker').datepicker("update", vm.form.month);
            
            $("#_startDate").datepicker("update", vm.form.startDate);
            $("#_endDate").datepicker("update", vm.form.endDate);
            
            $('.input-daterange').datepicker({
                format: "mm-dd-yyyy",
                orientation: 'bottom',
                autoclose: true,
            }).on("changeDate", function() {
                vm.form.startDate = $("#_startDate").val();
                vm.form.endDate = $("#_endDate").val();
            });
            
        };
        
        vm.initInputFields();
        vm.initDatePickers();
        
//----------------------------------------------------------------------------------------------
        
        vm.viewALLByRange = function(){
            if(vm.form.patient == null){
                alert('Please select a patient');
                return 0;
            }
            console.log('Patient: ');
            console.log(vm.form);
            vm.clearObjects();
            var exercises = [];
            for(var i=0; i<vm.allExercises.length; i++){
                if(vm.allExercises[i].name != 'ALL')
                    exercises[i] = vm.allExercises[i];
            }
            var startDate = new Date(vm.form.startDate);
            var endDate = new Date(vm.form.endDate);
            vm.modal.title = startDate.toDateString() + " - " + endDate.toDateString();
            $('#graphArea').slideDown();
            vm.createQuery(startDate, endDate, exercises);
        };
        
        vm.viewALLByMonth = function(){
            if(vm.form.patient == null){
                alert('Please select a patient');
                return 0;
            }
            vm.clearObjects();
            console.log(vm.form.exercise);
            var exercises = [];
            for(var i=0; i<vm.allExercises.length; i++){
                if(vm.allExercises[i].name != 'ALL')
                    exercises[i] = vm.allExercises[i];
            }
            var res = vm.form.month.split("/");
            var startDate = res[0] + "-01-" + res[1]; 
            startDate = new Date(startDate);
            var endDate = (startDate.getUTCMonth()+2) + "-01-" + res[1]; 
            endDate = new Date(endDate);
            endDate.setDate(endDate.getDate() - 1);
            vm.modal.title = vm.setMonthString(startDate.getUTCMonth()+1);
            $('#graphArea').slideDown();
            vm.createQuery(startDate, endDate, exercises);
        };
        
        vm.createQuery = function(startDate, endDate, exercises){
            console.log('Creating Query');
            console.log(vm.form.exercise);
            var limit = exercises.length;
            if(vm.form.exercise != undefined && vm.form.exercise != 'ALL'){
                $dataService.queryDateRange(startDate, endDate, vm.form.patient, vm.form.exercise).success(function(data){
                    if(data.length != 0){
                        data = vm.sortByDate(data);
                        vm.graphData.storedObjects[0] = data;
                        vm.graphData.datasets[0] = vm.graphAVG(data, 0, vm.form.exercise.name);
                    }
                    vm.updateMainGraph();
                });
            }
            else if(vm.form.exercise == undefined || vm.form.exercise == 'ALL'){
                vm.searchDatabase(startDate, endDate, vm.form.patient, exercises, 0, limit);
            }
        };
        
        vm.searchDatabase = function(startDate, endDate, patient, exercises, index, limit){
            console.log('Searching DataBase');
            var exId = exercises[index]._id;
            console.log('Exercise:');
            console.log(exId);
            console.log('Patient:');
            console.log(patient);
            $dataService.queryDateRange(startDate, endDate, patient, exId).success(function(data){
                data = vm.sortByDate(data);
                if(data.length != 0){
                    vm.graphData.storedObjects[index] = data;
                    vm.graphData.datasets[index] = vm.graphAVG(data, index, exercises[index].name);
                }
                index++;
                if(index != limit){
                    vm.searchDatabase(startDate, endDate, patient, exercises, index, limit);
                }
                else if(index == limit){
                    console.log('UPDATE NOW');
                    vm.updateMainGraph();
                }
            });
        };
        
//----------------------------------------------------------------------------------------------
        
        vm.clearObjects = function(){
            vm.graphData.storedObjects = [];
            vm.graphData.datasets = [];
            vm.graphData.labels = [];
            vm.datasetIndex = 0;
            vm.index = 0;
        };
        
        vm.graphAVG = function(data, index, exerciseName){
            console.log('GRAPHING AVG');
            var graphData = [];
            var labels = [];
            
            for(var i=0; i<data.length; i++){
                labels[i] = i;
                var avg = 0;
                console.log(i);
                for(var j=0; j<data[i].pressureAxial.length; j++){
                    avg += data[i].pressureAxial[j];
                }
                graphData[i] = avg/data[i].pressureAxial.length;
                console.log(graphData[i]);
            }
            
            var dataset = {
                label: exerciseName,
                backgroundColor: vm.colors[index%vm.colors.length].light,
                borderColor: vm.colors[index%vm.colors.length].dark,
                borderWidth: 1,
                data: graphData,
            }
            
            vm.graphData.labels[index] = labels;
            return dataset;
        };
        
        vm.graphPressure = function(data, index, exerciseName){
            console.log('Graphing Pressure:');
            console.log(exerciseName);
            var graphData = [];
            var labels = [];
            var ts = 0;
            for(var i=0; i<data.pressureAxial.length; i++){
                if(i%50 == 0){
                    labels[i] = ts;
                    ts++;
                }
                else{
                    labels[i] = '';
                }
                graphData[i] = data.pressureAxial[i];
            }
            
            var dataset = {
                label: exerciseName,
                backgroundColor: vm.colors[index%vm.colors.length].light,
                borderColor: vm.colors[index%vm.colors.length].dark,
                borderWidth: 1,
                data: graphData,
            }
            
            vm.graphData.labels = labels;
            return dataset;
        };
        
        vm.updateMainGraph = function(){
            console.log('---------Updating Chart Data---------');
            var color = Chart.helpers.color;
            vm.graphDisplayed = true;
            var oldCanvas = vm.resetCanvas();
            console.log('vm.graphData.datasets');
            console.log(vm.graphData.datasets);
            
            var size = -1;
            var labels = [];
            for(var i=0; i<vm.graphData.labels.length; i++){
                if(vm.graphData.labels[i].length > size){
                    labels = vm.graphData.labels[i];
                }
            }
            
            var config = {
                type: vm.graphData.type,
                data: {
                    labels: labels,
                    datasets: vm.graphData.datasets,
                },
                options : vm.options.mainGraph
            }
            
            var graph = new Chart(document.getElementById('my-graph').getContext('2d'), config);
            oldCanvas.remove();
            
            console.log('graph created');
            
            document.getElementById("my-graph").onclick = function(evt){
                var activePoints = graph.getElementAtEvent(evt);
                var point = activePoints[0];
                if (point !== undefined){
                    vm.zoom = true;
                    vm.graphData.datasetIndex = point._datasetIndex;
                    vm.graphData.index = point._index;
                    var originalDataObject = vm.graphData.storedObjects[point._datasetIndex][point._index];
                    
                    var date = new Date(originalDataObject.date);
                    date.setMinutes(date.getTimezoneOffset());
                    vm.modal.details = date.toDateString();
                    vm.modal.gameObject = originalDataObject;
                    
                    console.log('point Index: ' + vm.graphData.index);
                    console.log('dataset Index: ' + vm.graphData.datasetIndex);
                    
                    vm.originalObject = originalDataObject;
                    console.log('---------ORIGINAL OBJECT---------');
                    console.log(vm.originalObject);
                    
                    $('#myModal').modal('show');
                    vm.displayObject(originalDataObject, vm.graphData.datasetIndex);
                    $scope.$apply();
                }
            }
            
        };
        
        vm.resetCanvas = function(){
          var iframe = $('.chartjs-hidden-iframe');
          iframe.remove();
          var oldCanvas = $('#my-graph');
          oldCanvas.removeAttr('id');
          $('#graph').append('<canvas id="my-graph">');
          return oldCanvas;
        };
        
        vm.updateModalGraph = function(){
            console.log('Updating Chart Data');
            var color = Chart.helpers.color;
            vm.graphDisplayed = true;
            var oldCanvas = vm.resetModalCanvas();
            console.log('vm.graphData.datasets');
            console.log(vm.graphData.datasets);
            
            var config = {
                type: vm.graphData.type,
                data: {
                    labels: vm.graphData.labels,
                    datasets: vm.graphData.datasets,
                },
                options : vm.options.modalGraph
            }
            
            var graph = new Chart(document.getElementById('my-modalGraph').getContext('2d'), config);
            oldCanvas.remove();
            
        };
        
        vm.resetModalCanvas = function(){
          var iframe = $('#modalGraph > .chartjs-hidden-iframe');
          iframe.remove();
          var oldCanvas = $('#my-modalGraph');
          oldCanvas.removeAttr('id');
          $('#modalGraph').append('<canvas id="my-modalGraph">');
          return oldCanvas;
        };
        
        vm.displayObject = function(data, index){
            console.log('Displaying Object:');
            console.log(index);
            console.log(data);
            console.log(data.exercise);
            $dataService.getSingleExercise(data.exercise).success(function(exercise){
                vm.graphData.datasets = [];
                vm.graphData.datasets[0] = vm.graphPressure(data, index, exercise[0].name);
                vm.modal.exercise = exercise[0].name;
                vm.updateModalGraph();
            });
        };
        
        vm.next = function(){
            console.log('Next>>>>>>>>>>>>>>>>>>>>>>>>>>');
            try{
                vm.graphData.index++;
                console.log(vm.graphData.index);
                var datasetIndex = vm.graphData.datasetIndex;
                console.log(datasetIndex);
                var nextDataObject = vm.graphData.storedObjects[vm.graphData.datasetIndex][vm.graphData.index];
                vm.originalObject = nextDataObject;
                console.log(nextDataObject);
                var date = new Date(nextDataObject.date);
                date.setMinutes(date.getTimezoneOffset());
                console.log(date);
                vm.modal.details = date.toDateString();
                vm.modal.gameObject = nextDataObject;
                vm.displayObject(nextDataObject, datasetIndex);
            }
            catch(err){
                console.log('error: ' + err);
                vm.graphData.index--; //undo
            }
        };
        
        vm.prev = function(){
            console.log('Prev<<<<<<<<<<<<<<<<<<<<<<<<<<');
            try{
                vm.graphData.index--;
                console.log(vm.graphData.index);
                var datasetIndex = vm.graphData.datasetIndex;
                console.log(datasetIndex);
                var prevDataObject = vm.graphData.storedObjects[vm.graphData.datasetIndex][vm.graphData.index];
                vm.originalObject = prevDataObject;
                console.log(prevDataObject);
                var date = new Date(prevDataObject.date);
                date.setMinutes(date.getTimezoneOffset());
                console.log(date);
                vm.modal.details = date.toDateString();
                vm.modal.gameObject = prevDataObject;
                vm.displayObject(prevDataObject, datasetIndex);
            }
            catch(err){
                console.log('error: ' + err);
                vm.graphData.index++; //undo
            }
        };
        
        vm.setMonthString = function(currentMonth){
            var month;
            if(currentMonth == 1)       month = "Janurary";
            else if(currentMonth == 2)  month = "February";
            else if(currentMonth == 3)  month = "March";
            else if(currentMonth == 4)  month = "April";
            else if(currentMonth == 5)  month = "May";
            else if(currentMonth == 6)  month = "June";
            else if(currentMonth == 7)  month = "July";
            else if(currentMonth == 8)  month = "August";
            else if(currentMonth == 9)  month = "September";
            else if(currentMonth == 10) month = "October";
            else if(currentMonth == 11) month = "November";
            else if(currentMonth == 12) month = "December";
            return month;
        };
        
        vm.changeGraphType = function(type, graph){
            console.log('Type: ' + type);
            vm.graphData.type = type;
            if(graph == 'main'){
                vm.updateMainGraph();
            }else if(graph == 'modal'){
                vm.updateModalGraph();
            }
        };
        
        vm.sortByDate = function(ar){
           for (var i = 0; i < ar.length-1; i++) {
              var min = i;
              for (var j = i+1; j < ar.length; j++){
                  if (ar[j].date < ar[min].date) min = j;
              }
              var temp = ar[i];
              ar[i] = ar[min];
              ar[min] = temp;
           } 
           return ar;
        };
        
        vm.sortByExercise = function(ar){
           for (var i = 0; i < ar.length-1; i++) {
              var min = i;
              for (var j = i+1; j < ar.length; j++){
                  if (ar[j].code < ar[min].code) min = j;
              }
              var temp = ar[i];
              ar[i] = ar[min];
              ar[min] = temp;
           } 
           return ar;
        };
    
    };
    
})();

//function used only for submitting dummy data
function setDate(date){
    var year = date.year;
    var month = date.month - 1;
    var day = date.day;
    var d = new Date(Date.UTC(year, month, day, 0, 0, 0));
    var n =  d.toISOString();
    return n;
};
