/*global angular*/
/*global Chart*/
/*global $*/

(function() {
  
  angular
    .module('mainApp')
    .controller('homeCtrl', homeCtrl);
    
    homeCtrl.$inject = ['dataService'];
    
    function homeCtrl ($dataService) {
        menuInit();
    }
})();   

function menuInit(){
  $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
  });
}
