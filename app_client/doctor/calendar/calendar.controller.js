/*global angular*/
/*global Chart*/
/*global $*/

(function() {

    angular.module('mainApp')

    .controller('calendarCtrl', calendarCtrl);

    // calendarCtrl.$inject = ['$location', 'dataService', 'ui.calendar', 'ui.bootstrap', 'uiCalendarConfig'];
    calendarCtrl.$inject = ['$compile', '$location', 'dataService', '$scope'];

    // function calendarCtrl($compile, calendar, bootstrap, uiCalendarConfig) {
    function calendarCtrl($compile, $location, dataService, $scope) {
        var vm = this;
        vm.events = new Array();

        vm.getEvents = function() {
            dataService.getEvents().success(function(data) {

                    vm.events = data;
                    console.log(vm.events)
                    vm.populateEvents()
                    vm.cal();
                })
                .error(function(e) {
                    console.log(e);
                });
        }
        
        
        vm.getEvents();

        vm.populatedEvents = new Array();
        //vm.populateEvents(vm.events);

        vm.populateEvents = function() {
            for (var i = 0, max = vm.events.length; i < max; i++) {
                var event = {
                    title:'',
                    start:'',
                    allDay:'',
                    patient:'',
                    exercise:'',
                    gameData:'',
                    url:''
                };

                //fill event properties
                event.title = vm.events[i].patient;
                event.start = vm.events[i].date;
                event.allDay = 1;
                event.patient = vm.events[i].patient; //john smith
                event.exercise = vm.events[i].exercise;
                event.gameData = vm.events[i].gameData;
                
                //Add
                console.log(event);
                vm.populatedEvents.push(event);
                console.log(vm.populatedEvents);
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
                navLinks: true, // can click day/week names to navigate views
                editable: true,
                eventLimit: true, // allow "more" link when too many events
                events: vm.populatedEvents,
                eventClick: function(event) {
                    console.log(event);

                    $('#myModal').modal('show');
                    vm.graph(event);

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
                    
                }
                });
        }

        //  $('#calendar').fullCalendar('addEventSource', vm.events);
        //  $('#calendar').fullCalendar('rerenderEvents');

        vm.graph = function(event) {
            console.clear();
            console.log(event.start._d);
            var startDate = new Date(event.start._d);
            startDate.setMinutes(startDate.getTimezoneOffset());
            console.log("START DATE: " + startDate);
            var endDate = new Date(event.start._d);
            endDate.setMinutes(endDate.getTimezoneOffset());
            endDate.setDate(endDate.getDate() + 1);
            console.log("END DATE: " + endDate);
            console.log("PATIENT: " + event.patient);
            console.log("EX: " + event.exercise);
            dataService.queryDateRange(startDate, endDate, event.patient, event.exercise).success(function(data) {
                console.log('Start: ' + startDate + ' and end date: ' + endDate);
                console.log("DATA RETURNED");
                console.log(data);
                vm.updateMainGraph(data);
            });
        };

        vm.updateMainGraph = function(data) {
            console.log('---------Updating Chart Data---------');
            console.log(data);
            var color = Chart.helpers.color;
            var oldCanvas = vm.resetCanvas();

            var labels = [];
            var graphData = [];
            for (var i = 0; i < data[0].pressureAxial.length; i++) {
                labels[i] = i;
                graphData[i] = data[0].pressureAxial[i];
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