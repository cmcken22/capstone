(function () {

  angular
    .module('mainApp')
    .directive('sidebar', sidebar);

  function sidebar () {
    return {
      templateUrl: 'doctor/common/directives/sidebar/sidebar.template.html',
      controller: 'sidebarCtrl as sidevm'
    };
  }

})();

