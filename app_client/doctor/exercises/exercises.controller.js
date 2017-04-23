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
        
        vm.mainGraph = {
            labels: {
                yAxes: 'Average Pressure Values',
                xAxes: 'Game Objects',
            }
        }
        vm.mainGraph.options = {
            scales: {
                yAxes: [{ scaleLabel: { display: true, labelString: vm.mainGraph.labels.yAxes }}],
                xAxes: [{ scaleLabel: { display: true, labelString: vm.mainGraph.labels.xAxes }}],
             }
        }
        
        vm.modalGraph = {
            labels: {
                yAxes: 'Pressure Values',
                xAxes: 'Time (Seconds)',
            }
        }
        vm.modalGraph.options = {
            scales: {
                yAxes: [{ scaleLabel: { display: true, labelString: vm.modalGraph.labels.yAxes }}],
                xAxes: [{ scaleLabel: { display: true, labelString: vm.modalGraph.labels.xAxes }, ticks: { autoSkip: false } }],
             }
        }
        vm.modalGraph_2 = {}
        vm.modalGraph_2.options = {
            scales: {
                yAxes: [{ scaleLabel: { display: true, labelString: vm.modalGraph.labels.yAxes }, ticks: { beginAtZero: true }}],
                xAxes: [{ scaleLabel: { display: true, labelString: vm.modalGraph.labels.xAxes }, ticks: { autoSkip: false } }],
             }
        }
        
        vm.refreshOptions = function(){
            vm.mainGraph.options = {
                scales: {
                    yAxes: [{ scaleLabel: { display: true, labelString: vm.mainGraph.labels.yAxes }}],
                    xAxes: [{ scaleLabel: { display: true, labelString: vm.mainGraph.labels.xAxes }}],
                 }
            }
            vm.modalGraph.options = {
                scales: {
                    yAxes: [{ scaleLabel: { display: true, labelString: vm.modalGraph.labels.yAxes }}],
                    xAxes: [{ scaleLabel: { display: true, labelString: vm.modalGraph.labels.xAxes }, ticks: { autoSkip: false } }],
                 }
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
            exercise : null,
            patient: null,
            startDate : vm.currentDate.string,  //todays date
            endDate : vm.nextDate.string,       //a week from today
        }
        
        if($routeParams.param != undefined){
            console.log('PARAMS-------');
            console.log($routeParams.param.patientID);
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
            pressureType: 0,
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
            if(vm.form.exercise == null){
                alert('Please select an exercise');
                return 0;
            }
            if(vm.form.patient == null){
                alert('Please select a patient');
                return 0;
            }
            console.log('Form: ');
            console.log(vm.form);
            vm.clearObjects();
            var startDate = new Date(vm.form.startDate);
            var endDate = new Date(vm.form.endDate);
            vm.modal.title = startDate.toDateString() + " - " + endDate.toDateString();
            $('#graphArea').slideDown();
            vm.createQuery(startDate, endDate);
        };
        
        vm.viewALLByMonth = function(){
            if(vm.form.exercise == null){
                alert('Please select an exercise');
                return 0;
            }
            if(vm.form.patient == null){
                alert('Please select a patient');
                return 0;
            }
            vm.clearObjects();
            console.log(vm.form.exercise);
            var res = vm.form.month.split("/");
            var startDate = res[0] + "-01-" + res[1]; 
            startDate = new Date(startDate);
            var endDate = (startDate.getUTCMonth()+2) + "-01-" + res[1]; 
            endDate = new Date(endDate);
            endDate.setDate(endDate.getDate() - 1);
            vm.modal.title = vm.setMonthString(startDate.getUTCMonth()+1);
            vm.createQuery(startDate, endDate);
        };
        
        vm.createQuery = function(startDate, endDate){
            $dataService.queryDateRange(startDate, endDate, vm.form.patient, vm.form.exercise).success(function(data){
                console.clear();
                console.log(data.length);
                console.log(data);
                if(data.length != 0){
                    $('#graphArea').slideDown();
                    data = vm.sortByDate(data);
                    vm.graphData.datasets = vm.graphALLavg(data, vm.form.exercise.name);
                    vm.updateMainGraph();
                }else if(data.length == 0){
                    alert("Error: no data found.");
                }
            });
        };
        
        vm.graphALLavg = function(data, exerciseName){
            console.log('GRAPHING ALL AVG');
            var graphAxial = []; var graphA = []; var graphB = []; var graphC = [];
            var labels = [];
            
            for(var i=0; i<data.length; i++){
                var avgAxial = 0; var avgA = 0; var avgB = 0; var avgC = 0;
                labels[i] = i;
                vm.graphData.storedObjects[i] = data[i];
                for(var j=0; j<data[i].pressureAxial.length; j++){
                    avgAxial += data[i].pressureAxial[j];
                    avgA += data[i].pressureA[j];
                    avgB += data[i].pressureB[j];
                    avgC += data[i].pressureC[j];
                }
                graphAxial[i] = avgAxial/data[i].pressureAxial.length;
                graphA[i] = avgA/data[i].pressureA.length;
                graphB[i] = avgB/data[i].pressureB.length;
                graphC[i] = avgC/data[i].pressureC.length;
            }
            vm.graphData.labels = labels;
            
            var colorIndex = 0;
            var datasets = [{
                label: 'Axial',
                backgroundColor: vm.colors[colorIndex%vm.colors.length].light,
                borderColor: vm.colors[(colorIndex++)%vm.colors.length].dark,
                borderWidth: 1,
                data: graphAxial,
            },{
                label: 'A',
                backgroundColor: vm.colors[colorIndex%vm.colors.length].light,
                borderColor: vm.colors[(colorIndex++)%vm.colors.length].dark,
                borderWidth: 1,
                data: graphA,
            },{
                label: 'B',
                backgroundColor: vm.colors[colorIndex%vm.colors.length].light,
                borderColor: vm.colors[(colorIndex++)%vm.colors.length].dark,
                borderWidth: 1,
                data: graphB,
            },{
                label: 'C',
                backgroundColor: vm.colors[colorIndex%vm.colors.length].light,
                borderColor: vm.colors[(colorIndex++)%vm.colors.length].dark,
                borderWidth: 1,
                data: graphC,
            }];
            return datasets;
        };
        
//----------------------------------------------------------------------------------------------
        
        vm.clearObjects = function(){
            vm.graphData.storedObjects = [];
            vm.graphData.datasets = [];
            vm.graphData.labels = [];
            vm.datasetIndex = 0;
            vm.index = 0;
        };
        
        vm.clearForm = function(){
            vm.form = {
                date : "",
                month : vm.currentDate.month + "/" + vm.currentDate.year,
                exercise : null,
                patient: null,
                startDate : vm.currentDate.string,  //todays date
                endDate : vm.nextDate.string,       //a week from today
            }
            $("#exercise-select").select2('val', null);
    		$("#exercise-select-range").select2('val', null);
    		$("#patient-select").select2('val', null);
    		$("#patient-select-range").select2('val', null);
        };
        
        vm.clearGraph = function(){
            console.clear();
            console.log('CLEARING GRAPH');
            vm.clearObjects();
            vm.clearForm();
            var oldCanvas = vm.resetCanvas();
            oldCanvas.remove();
            $('#graphArea').hide();
        };
        
        vm.graphPressure = function(data, pressureType, exerciseName){
            var graphData = [];
            var labels = [];
            var ts = 0;
            
            var _data = [];
            switch(pressureType) {
                case 0:
                    vm.modalGraph.labels.yAxes = 'Pressure (Axial)';
                    vm.refreshOptions();
                    _data = data.pressureAxial;
                    break;
                case 1:
                    vm.modalGraph.labels.yAxes = 'Pressure (A)';
                    vm.refreshOptions();
                    _data = data.pressureA;
                    break;
                case 2:
                    vm.modalGraph.labels.yAxes = 'Pressure (B)';
                    vm.refreshOptions();
                    _data = data.pressureB;
                    break;
                case 3:
                    vm.modalGraph.labels.yAxes = 'Pressure (C)';
                    vm.refreshOptions();
                    _data = data.pressureC;
                    break;
            }
            
            for(var i=0; i<_data.length; i++){
                if(i%50 == 0){
                    labels[i] = ts;
                    ts++;
                }
                else{
                    labels[i] = '';
                }
            }
            
            var dataset = {
                label: exerciseName,
                backgroundColor: vm.colors[pressureType%vm.colors.length].light,
                borderColor: vm.colors[pressureType%vm.colors.length].dark,
                borderWidth: 1,
                data: _data,
            }
            
            vm.graphData.labels = labels;
            return dataset;
        };
        
        
        vm.updateMainGraph = function(){
            console.log('-------------------\n Updating Chart Data \n-------------------');
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
                    labels: vm.graphData.labels,
                    datasets: vm.graphData.datasets,
                },
                options : vm.mainGraph.options
            }
            
            var graph = new Chart(document.getElementById('my-graph').getContext('2d'), config);
            oldCanvas.remove();
            
            console.log('graph created');
            
            document.getElementById("my-graph").onclick = function(evt){
                var activePoints = graph.getElementAtEvent(evt);
                var point = activePoints[0];
                if (point !== undefined){
                    vm.zoom = true;
                    vm.graphData.pressureType = point._datasetIndex;
                    vm.graphData.index = point._index;
                    console.log('pointIndex: ' + vm.graphData.index);
                    
                    var originalDataObject = vm.graphData.storedObjects[vm.graphData.index];
                    console.log('DATA OBJECT: ');
                    console.log(originalDataObject);
                    
                    var date = new Date(originalDataObject.date);
                    date.setHours(0,0,0,0);
                    console.log(date);
                    vm.modal.details = date.toDateString();
                    vm.modal.gameObject = originalDataObject;
                    vm.originalObject = originalDataObject;
                    
                    $('#myModal').modal('show');
                    vm.displayObject(originalDataObject);
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
        
        var modalGraph = null;
        vm.updateModalGraph = function(){
            console.clear();
            console.log('Updating Modal Graph');
            vm.graphDisplayed = true;
            var oldCanvas = vm.resetModalCanvas();
            console.log('vm.graphData.datasets');
            console.log(vm.graphData.datasets);
            
            console.log(vm.modalGraph);
            
            var config = {
                type: vm.graphData.type,
                data: {
                    labels: vm.graphData.labels,
                    datasets: vm.graphData.datasets,
                },
                options : vm.modalGraph.options,
            }
            
            modalGraph = new Chart(document.getElementById('my-modalGraph').getContext('2d'), config);
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
        
        
        vm.displayObject = function(data){
            $dataService.getSingleExercise(data.exercise).success(function(exercise){
                vm.graphData.datasets = [];
                vm.graphData.datasets[0] = vm.graphPressure(data, vm.graphData.pressureType, exercise[0].name);
                vm.modal.exercise = exercise[0].name;
                vm.updateModalGraph();
            });
        };
        
        vm.next = function(){
            console.log('Next>>>>>>>>>>>>>>>>>>>>>>>>>>');
            try{
                vm.graphData.index++;
                console.log(vm.graphData.index);
                var nextDataObject = vm.graphData.storedObjects[vm.graphData.index];
                vm.originalObject = nextDataObject;
                console.log(nextDataObject);
                var date = new Date(nextDataObject.date);
                date.setMinutes(0,0,0,0);
                console.log(date);
                vm.modal.details = date.toDateString();
                vm.modal.gameObject = nextDataObject;
                vm.displayObject(nextDataObject);
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
                var nextDataObject = vm.graphData.storedObjects[vm.graphData.index];
                vm.originalObject = nextDataObject;
                console.log(nextDataObject);
                var date = new Date(nextDataObject.date);
                date.setHours(0,0,0,0);
                console.log(date);
                vm.modal.details = date.toDateString();
                vm.modal.gameObject = nextDataObject;
                vm.displayObject(nextDataObject);
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
