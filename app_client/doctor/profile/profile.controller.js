(function() {
  
  angular.module('mainApp')
  .controller('profileCtrl', profileCtrl);

  profileCtrl.$inject = ['$location', 'dataService'];
  
  
  function profileCtrl($location, dataService) {
    var vm = this;

    vm.user = {};

    dataService.getProfile()
      .success(function(data) {
        vm.user = data;
      })
      .error(function (e) {
        console.log(e);
      });
  }

})();