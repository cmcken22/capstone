/*global angular*/
/*global Chart*/
/*global $*/

(function() {

    angular.module('mainApp')

    .controller('calendarCtrl', calendarCtrl);

    // calendarCtrl.$inject = ['$location', 'dataService', 'ui.calendar', 'ui.bootstrap', 'uiCalendarConfig'];
    calendarCtrl.$inject = ['$compile', '$location', 'authentication','dataService', '$scope'];

    // function calendarCtrl($compile, calendar, bootstrap, uiCalendarConfig) {
    function calendarCtrl($compile, $location,authentication, dataService, $scope) {
        var vm = this;
        vm.everythingLoaded = false;
        vm.events = new Array();
        vm.exerciseList=[];
        vm.selectedPatient=authentication.currentUser()._id;
        vm.populatedEvents = new Array();
        
        
        
        vm.getEvents= function(){
            dataService.getExercise().then(function(data){
                console.log("getExercises")
                console.log(data.data[0]._id);
                data.data.forEach(function(data){ 
                    vm.exerciseList.push(data)}
                )
                dataService.getEventByPatientId(vm.selectedPatient).success(function(data) {
                    
                    vm.events = data;
                    vm.events.forEach(function(data)
                    {
                        
                        vm.exerciseList.forEach(function(ex)
                        {
                            if(ex._id == data.exercise)
                            {
                                data.exercise=ex;
                            }
                        }) 
                    })
                    vm.everythingLoaded = true;
                    vm.populateEvents()
                    vm.cal();
                })
                .error(function(e) {
                    console.log(e);
                });
            })
        }
     vm.getEvents();
     //vm.getEvents();
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
                console.log(vm.events[i].exercise)

                if(vm.events[i].type == "Appointment")
                {
                    event.title = "Appointment" ;
                }
                else{
                    event.title= vm.events[i].exercise.name;
                    
                }
                
                event.start = vm.events[i].date;
                event.end = vm.events[i].endTime;
                event.allDay = 0;
                event.patient = vm.events[i].patient; //john smith
                event.exercise = vm.events[i].exercise;
                event.gameData = vm.events[i].gameData;
                event.completed = vm.events[i].completed;
                event.type = vm.events[i].type;
               
                //Add
                //console.log(event);
                    if (event.type == "appointment" || event.type == true || event.type == 'true') {
                        //yellow
                        event.backgroundColor = '#FFBF10';
                        event.textColor = 'FFFFFF';
                        //    event.color = '#378006'
                
                        //vm.populatedApps.push(event)
                    }
                    else if (event.type == null || event.type == "false"|| event.type =="" || event.type == false) {
                        //orange
                        event.backgroundColor = "#FF6c3e";
                        event.textColor = 'FFFFFF';
                        // event.color = "#FF4910"
                
                    }
                     if (event.completed == true) {
                        //orange
                        event.backgroundColor = "#1993DC";
                        event.textColor = 'FFFFFF';
                        // event.color = "#FF4910"
                
                    }
                    vm.populatedEvents.push(event);
               
                //console.log(vm.populatedEvents);
            }
            
        }





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
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Pressure Values'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Time (Seconds)'
                    }
                }],
            }
        }

        vm.options.mainGraph = {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Average Pressure Values'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'gameData Objects'
                    }
                }],
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


        vm.cal = function() {
            
            $('#calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,basicWeek,basicDay'
                },

                defaultDate: '2017-02-12',
                timezone: 'local',
                navLinks: true, // can click day/week names to navigate views
                editable: true,
                eventLimit: true, // allow "more" link when too many events
                events: vm.populatedEvents,
                
                eventClick: function(event) {
                    console.log(event);
                    
                   
                   
                   

                    // vm.updateMainGraph(event);
                    if (event.url) {
                        // window.open(event.url);
                        return 0;
                    }
                },
                
                eventRender: function(event){
                    var patient = event.patient; 
                    var exercise = event.exercise;
                    var gameData = event.gameData;
                    var completed = event.completed;
                    var type = event.type;
                }
                });
                
        }

        //  $('#calendar').fullCalendar('addEventSource', vm.events);
       


    }

})();