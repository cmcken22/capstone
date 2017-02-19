/*global $*/
(function () {

  angular
    .module('mainApp')
    .controller('sidebarCtrl', sidebarCtrl);

  sidebarCtrl.$inject = ['$scope','$rootScope','$location','authentication','dataService'];
  
  function sidebarCtrl($scope,$rootScope, $location, authentication,dataService) {
    
    
    var vm = this;
    vm.signOut = function(){
      authentication.logout();
    }
    vm.loaded = false;
    vm.numNewMessages;
    
    vm.getNumUnread = function(){
      dataService.numUnreadMessages().success(function(data){
        vm.numNewMessages = data.count;
        vm.loaded = true;
        if(vm.numNewMessages > 0){
          $('#sidebar-messages').addClass('show-circle')
        }
      })
    }
    
    $scope.$on("messageRead", function(){
      vm.numNewMessages--;
      if(vm.numNewMessages<=0) {
        vm.numNewMessages = 0;
        $('#sidebar-messages').removeClass('show-circle')
      }
    });
    
    $scope.$on("messageUnread", function(){
      vm.numNewMessages++;
      if(!$('#sidebar-messages').hasClass('show-circle')){
        $('#sidebar-messages').addClass('show-circle')
      }
    });
    
    
    vm.sidebarInit = function(path){
      $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#main-wrapper").toggleClass("toggled");
      });
      
      $('sidebar ul.sidebar-nav li').each(function(){
        if ( $(this).find('a').attr('href').match(path) ) {
          $(this).addClass('active');
        }else {
          $(this).removeClass('active');
        }
      })
    }; 
    
    vm.getNumUnread();
    vm.sidebarInit($location.path());
  }
  
})();
