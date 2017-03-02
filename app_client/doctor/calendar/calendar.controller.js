/*global angular*/
/*global Chart*/
/*global $*/

(function() {
    angular.module('mainApp')
    .controller('calendarCtrl', calendarCtrl);
    calendarCtrl.$inject = ['$compile', '$location', 'authentication','dataService', '$scope'];

    function calendarCtrl($compile, $location,authentication, dataService, $scope) {
        var vm = this;
        vm.everythingLoaded = false;
        vm.events = new Array();
        vm.patient_ids = [];
        vm.patientList=[];
        vm.exerciseList=[];
        vm.populatedApps=[];
        vm.selectedPatient="Appointment";
        vm.populatedEvents = new Array();
        
        vm.updateCalendar= function(){
        console.log('updating calendar')
            
        vm.populateEvents()
        $("#calendar").fullCalendar('removeEvents');
        $("#calendar").fullCalendar('addEventSource', vm.populatedEvents);
        $("#calendar").fullCalendar('rerenderEvents');
                    
        }
        
        vm.getPatients= function(){
            dataService.getPatients().then(function(data){
                console.log(data);
                data.data.forEach(function(data){ 
                    vm.patientList.push(data)
                    vm.patient_ids.push(data._id)}
                )
                console.log(vm.patient_ids)
                vm.getExercises()
                vm.getEvents();
            })
        }
        
        vm.getExercises= function(){
            dataService.getExercise().then(function(data){
                console.log("getExercises")
                console.log(data);
                data.data.forEach(function(data){ 
                    vm.exerciseList.push(data)}
                )
            })
        }
        $('#select').on('change', function() {
            
            vm.selectedPatient=this.value;
            console.log(vm.selectedPatient)
              vm.updateCalendar();
            })
        vm.getEvents = function() {
            dataService.getEventByPatientId(vm.patient_ids).success(function(data) {
                    vm.events = data;
                    vm.events.forEach(function(data)
                    {
                        vm.patientList.forEach(function(p)
                        {
                            if(p._id == data.patient)
                            {
                                data.patient=p;
                            }
                        })
                        vm.exerciseList.forEach(function(ex)
                        {
                            if(ex._id == data.exercise)
                            {
                                data.exercise=ex;
                            }
                        }) 
                    })
                    vm.everythingLoaded = true;
                    console.log(vm.events)
                    vm.populateEvents()
                    vm.cal();
                })
                .error(function(e) {
                    console.log(e);
                });
        }
        
        dataService.getPatients().success(function(data){
        vm.patientNames = data.map(function(a) {
          return { id:a._id, text:a.name }
        });
        
        $("#patient-select").select2({
				  data: vm.patientNames,
				  placeholder: "Select a patient"
				}).on("change", function(e) {
				  vm.compose.patientId = $("#patient-select").val();
				});
        });
        
        vm.getPatients();

        vm.populateEvents = function() {
            vm.populatedEvents=[];
            for (var i = 0, max = vm.events.length; i < max; i++) {
                var event = {
                    title:'',
                    start:'',
                    allDay:'',
                    patient:'',
                    exercise:'',
                    gameData:'',
                    completed:'',
                    end:'',
                    type:'',
                    url:'',
                    color:'',
                    description:''
                };
                event.title = vm.events[i].patient.name;

                if(vm.events[i].exercise != null){
                 event.title = event.title + " - " + vm.events[i].exercise.name;
                }
                event.start = vm.events[i].date;
                event.end = vm.events[i].endTime;
                event.allDay = 0;
                event.patient = vm.events[i].patient; //john smith
                event.exercise = vm.events[i].exercise;
                event.gameData = vm.events[i].gameData;
                event.completed = vm.events[i].completed;
                event.type = vm.events[i].type;
                
                
                if(vm.events[i].exercise != null)
                event.description = vm.events[i].exercise.name;

                
                if (vm.selectedPatient == event.patient._id) {
                    if (event.type == "appointment"|| event.type == "true"||event.type==true) {
                        //yellow
                        event.backgroundColor = '#FFBF10';
                        event.textColor = 'FFFFFF';
                        
                
                        
                    }
                    else if (event.type == null || event.type == "false" || event.type == "" || event.type ==false) {
                        //orange
                        event.backgroundColor = "#FF6c3e";
                        event.textColor = 'FFFFFF';
                        
                
                    }
                    if (event.completed == true) {
                        //orange
                        event.backgroundColor = "#1993DC";
                        event.textColor = 'FFFFFF';
                        // event.color = "#FF4910"
                
                
                    }
                    vm.populatedEvents.push(event);
                }
                else if (vm.selectedPatient == "Appointment") {
                    if (event.type == "appointment"|| event.type == "true"||event.type==true) {
                        //yellow
                        event.backgroundColor = '#FFBF10';
                        event.textColor = 'FFFFFF';
                        vm.populatedEvents.push(event);
                    }
                }
            }
            
        }
        
        vm.allExercises = [];
        vm.allPatients = [];

        vm.graphDisplayed = false;
        vm.zoom = false;
        
        vm.options = {
            scales: {
                yAxes: [{ scaleLabel: { display: true, labelString: 'Pressure Values' }}],
                xAxes: [{ scaleLabel: { display: true, labelString: 'Time (Seconds)' }}],
            }
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
        
        vm.cal = function() {
            
            $('#calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,basicWeek,basicDay'
                },
                timezone: 'local',
                defaultDate: '2017-02-12',
                navLinks: true, // can click day/week names to navigate views
                editable: true,
                eventLimit: true, // allow "more" link when too many events
                events: vm.populatedEvents,
                
                eventClick: function(event) {
                    $('#myModal').modal('show');
                    vm.graph(event);
                    if (event.url) {
                        return 0;
                    }
                },
                
                eventRender: function(event){
                    var patient = event.patient; 
                    var exercise = event.exercise;
                    var gameData = event.gameData;
                    var completed = event.completed;
                    var type = event.type;
                    var description = event.description;
                }
                });
                
        };

        vm.gameObject = '';
        vm.graph = function(event) {
            dataService.getGameDataById(event.gameData).then(function(data){
                vm.gameObject = data.data[0];
                vm.updateMainGraph(data.data[0]);
            });
        };

        vm.updateMainGraph = function(data) {
            console.log('---------Updating Chart Data---------');
            console.log(data);
            var oldCanvas = vm.resetCanvas();
            
            var graphAxial = []; var graphA = []; var graphB = []; var graphC = [];
            var labels = [];
            for (var i = 0; i < data.pressureAxial.length; i++) {
                labels[i] = i;
                graphAxial[i] = data.pressureAxial[i];
                graphA[i] = data.pressureA[i];
                graphB[i] = data.pressureB[i];
                graphC[i] = data.pressureC[i];
            }
            
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
            
            var config = {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: datasets,
                },
                options : vm.options
            };

            var graph = new Chart(document.getElementById('my-graph').getContext('2d'), config);
            oldCanvas.remove();
        };

        vm.resetCanvas = function() {
            var iframe = $('.chartjs-hidden-iframe');
            iframe.remove();
            var oldCanvas = $('#my-graph');
            oldCanvas.removeAttr('id');
            $('#graph').append('<canvas id="my-graph">');
            return oldCanvas;
        };


    }

})();