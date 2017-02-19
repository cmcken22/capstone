/*global $*/
/*global jQuery*/
(function() {
  
  angular
    .module('mainApp')
    .controller('messagesCtrl', messagesCtrl);

    
    messagesCtrl.$inject = [ '$scope','dataService', 'authentication'];
    
    
    function messagesCtrl ($scope, dataService, authentication) {
      var vm = this;
      vm.currentUser = authentication.currentUser();
      vm.messages;
      vm.receivedCount;
      vm.sentCount;
      vm.unreadCount;
      vm.initUnreadCount;
      vm.everythingLoaded = false;
      vm.compose = {
        messageSubject : "",
        messageBody : ""
      }
      vm.patientNames;
      vm.replyBody = "";
      
      
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
      
      
      vm.getMessages = function(){
        dataService.getMessages().success(function(data){
          console.log(data);
          vm.messages = data;
          vm.messageCount = data.length;
          vm.everythingLoaded = true;
          vm.parseMessageData();//used to get number of unread, sent, and received
        })
      };
      
      vm.getPatientName = function(patientId){
        if(vm.patientNames){
          var patient = $.grep(vm.patientNames, function(e){
            return e.id == patientId; 
          })
          if(patient[0]) return patient[0].text;
        } else return "";
      };
      
      vm.activeReply;
      vm.replyClick = function(message){
        vm.activeReply = message;
        dataService.getReplys(message._id).success(function(data){
          vm.activeReply.replysData = data;
        })
      }
      
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
      
      vm.replySenderName = function(replySender){
        var currentUser = authentication.currentUser();
        
        if(replySender == currentUser._id) return currentUser.name;
        else return vm.getPatientName(replySender);
      }
      
      

      
      
      
      vm.messageSend = function(){
        var messageData = {
          patientId : vm.compose.patientId,
          messageSubject : vm.compose.messageSubject,
          messageBody : vm.compose.messageBody
        }
        dataService.doctorPostMessage(messageData).success(function(data){
          vm.compose.messageSubject = "";
          vm.compose.messageBody = "";
          vm.sentCount ++;
          jQuery('#compose .alert-div').html('<div class="alert alert-dismissible alert-success"><button type="button" class="close" data-dismiss="alert">&times;</button>Your message has successfully been sent.</div>');
        }).error(function(){
          jQuery('#compse .alert-div').html('<div class="alert alert-dismissible alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button>There was an error sending your message.</div>');
        })
      }
      
      vm.readMessage = function(message){
        if(!message.read && message.sender != vm.currentUser._id){
          if($('#rec-' + message._id + ' .panel-heading').hasClass('message-unread')){
            $('#rec-' + message._id + ' .panel-heading').removeClass('message-unread');
            $('#unread-' + message._id + ' .panel-heading').removeClass('message-unread');
            dataService.toggleMessage(message._id).success(function(){
              $scope.$emit('messageRead')
              vm.unreadCount -- ;
            });
          }
        }
        if(message.replys){
          if(message.replys.length > 0){
            dataService.getReplys(message._id).success(function(data){
              message.replysData = data;
            })
          }
        }
      };
      
      vm.markUnread = function(message){
        dataService.toggleMessage(message._id).success(function(){
          vm.unreadCount ++;
          $scope.$emit('messageUnread')
          message.read = false;
          $('#rec-' + message._id + ' .panel-heading').addClass('message-unread');
          $('#unread-' + message._id + ' .panel-heading').addClass('message-unread');
        });
      }
      
      vm.isMessageRead = function(read){
        if(read) return 'message-read';
        else return 'message-unread';
      }
      
      vm.parseMessageData = function(){
        var unreadCount = 0;
        var receivedCount = 0;
        var sentCount = 0;
        vm.messages.forEach(function(message){
          if(message.sender == vm.currentUser._id){
            sentCount++;
          }
          if(message.receiver == vm.currentUser._id){
            receivedCount++;
            if(message.read == false){
              unreadCount++;
            }
          }
        });
        vm.sentCount = sentCount;
        vm.receivedCount = receivedCount;
        vm.unreadCount = unreadCount;
        vm.initUnreadCount = unreadCount;
      }
     vm.dateString = function(date){
        var date = new Date(date);
        return date.toDateString() +', '+ date.toLocaleTimeString()
      };
      
      vm.getMessages();
    }


})();