/*global angular*/

(function() {

  angular
    .module('mainApp')
    .controller('managerCtrl', managerCtrl);

  managerCtrl.$inject = ['$scope', 'dataService'];

  function managerCtrl($scope, $dataService) {
    var vm = this;
    vm.clicked = true;
    vm.exerciseInfo = {
      name: "",
      description: "",
    };
    vm.allex = [];
    
    $dataService.getExercise().success(function(data) {
      console.log(data);
      $scope.allex = data;
    }).error(function(err){
      console.log(err);
    });

    vm.addExercise = function() {
      console.log("add exercise pressed");
      console.log(vm.exerciseInfo);
      $dataService.postExercise(vm.exerciseInfo).success(function(data){
        console.log(data)
      })
      .error(function(err) {
        alert(err);
      });
    };
  }
  
})();