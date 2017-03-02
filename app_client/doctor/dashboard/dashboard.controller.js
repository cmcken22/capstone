/*global angular*/
/*global Chart*/
/*global $*/

(function() {
  
  angular
    .module('mainApp')
    .controller('homeCtrl', homeCtrl);
    
    homeCtrl.$inject = ['authentication','dataService', '$location'];
    
    function homeCtrl (authentication, dataService, $location) {
      var vm = this;
      
      vm.activeReply;
      vm.patientNames
      vm.currentUser=authentication.currentUser();
      vm.unreadCount;
      vm.patients;
      dataService.getPatients().success(function(data){
         vm.patients = data;
        vm.patientNames = data.map(function(a) {
          return { id:a._id, text:a.name }
        });
       });
     
      dataService.getMessages().then(function(data){
        vm.messages=data.data;
        vm.parseMessageData()
      })
      
      vm.replyClick = function(message){
        vm.activeReply = message;
        dataService.getReplys(message._id).success(function(data){
          vm.activeReply.replysData = data;
        })
      }
      vm.parseMessageData = function(){
          var unreadCount = 0;

          vm.messages.forEach(function(message){
            if(message.receiver == vm.currentUser._id){
              if(message.read == false){
                unreadCount++;
              }
            }
          });
          vm.unreadCount = unreadCount;
        }
        
        
      vm.getSenderName = function(replySender){
        if(replySender == vm.currentUser._id) return vm.currentUser.name;
        else return vm.patientName(replySender);
      }
      vm.patientName = function(patientId){
        if(vm.patientNames){
          var patient = $.grep(vm.patientNames, function(e){
            return e.id == patientId; 
          })
          if(patient[0]) return patient[0].text;
        } else return "";
      };
      
      vm.postReply = function(){
        var replyData = {
          body:vm.replyBody,
          message:vm.activeReply._id
        }
        dataService.postReply(replyData).success(function(data){
          vm.replyBody = "";
          vm.replyClick(vm.activeReply)//get the replys again
          jQuery('#reply-modal .alert-div').html('<div class="alert alert-dismissible alert-success"><button type="button" class="close" data-dismiss="alert">&times;</button>Your reply has successfully been sent.</div>');
        })
        .error(function(){
          jQuery('#reply-modal .alert-div').html('<div class="alert alert-dismissible alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button>There was an error sending your reply.</div>');
        })
      
      }
      vm.togglePatient = function(patientId){
        var selector = '#' + patientId + ' .toggle-section';
         jQuery(selector).toggleClass('toggled');
      };
      vm.messageSend = function(patientId){
        var messageData = {
          patientId : patientId,
          messageSubject : vm.messageSubject,
          messageBody : vm.messageBody
        }
        
        dataService.doctorPostMessage(messageData).success(function(data){
          vm.messageSubject = "";
          vm.messageBody = "";
          jQuery('#dash-messaging .alert-div').html('<div class="alert alert-dismissible alert-success"><button type="button" class="close" data-dismiss="alert">&times;</button>Your message has successfully been sent.</div>');
        }).error(function(){
          jQuery('#dash-messaging .alert-div').html('<div class="alert alert-dismissible alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button>There was an error sending your message.</div>');
        })
      };
      vm.viewData = function(patientID){
        var param = {
          patientID: patientID
        };
        $location.path('/exercises').search({param: param});
      };
  }
})();   
