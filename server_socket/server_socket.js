var mongoose    = require('mongoose');
var gameData    = mongoose.model('gameData');
var user        = mongoose.model('User');
var event        = mongoose.model('event');

console.log('sup');
module.exports.onConnection = function(socket){
    
    console.log('New Socket Connection');
    
    socket.on('post-gamedata',function(data){
	    console.log('Game is Finished');
	    var newPost = new gameData();
	    console.log(newPost._id); 
	    newPost.date = Date.now();
        newPost.time = data.time;

        newPost.save(function(err){
        //here
        
        	console.log(newPost._id);
            
            
            if(err) console.log(err);
        })
	});
	
	socket.on('login',function(data){
	    console.log('LOGIN');
	    console.log('Searching for ' + data.email);
	    user.findOne({email: data.email}, function(err, user){
	        if(err){
	            console.log(err);
	           //socket.emit("login-failed",err);
	        }
	        if(user){
	            console.log(user);
	            
	            // event.find({patient: user._id, completed:false}).forEach( function(err,singleEvent)
	            // {
	            // 	if (err)
	            // 		console.log(err);
	            // 	console.log('Retrieving incomplete exercises for ' + user.name);
	            	
	            // 	socket.emit("login-response",singleEvent);
	            // });
	            
	    //         event.find({patient: user._id, completed:false}, function(err,events)
	    //         {
	    //         	if (err)
	    //         		console.log(err);
	    //         	console.log('Retrieving incomplete exercises for ' + user.name);
	            	
	    //         	// Whelp, looks like Unity socket.io can't handle multiple items,
	    //         	// just resets the connection.
	    //         	//socket.emit("login-response",events);
	    //         	events.forEach(function(singleE){
    	// 				console.log('Thing retrieved:' + singleE);
    	// 				//socket.emit("login-response",singleE);
					// });
	    //         	//socket.emit("login-response",events);
	    //         });
	    
	            var userDataTemp = {
    						"_id" : user._id,
    						"name" : user.name,
    						"role" : user.role
    					};
	            socket.emit("login-response",userDataTemp);
	            
	            event.find({patient: user._id, completed:false}).sort( [['_id', -1]] ).populate('exercise').populate('doctor').exec(function(err,events)
	            {
	            	if (err) throw err;
	            	console.log('Retrieving incomplete exercises for ' + user.name);
	            	events.forEach(function(singleE){
    					//console.log('Thing retrieved:' + singleE);
    					
    					var exerciseData = {
    						"_id" : singleE._id,
    						"name" : singleE.exercise.name,
    						"description" : singleE.exercise.description,
    						"date" : singleE.date,
    						"endTime" : singleE.endTime,
    						"type" : singleE.type,
    						"doctor" : singleE.doctor.name
    					};
    					
    					//console.log('The hell: ' + exerciseData);
    					socket.emit("exercise-data",exerciseData);
					});
	            	//socket.emit("exercises-available",events);
	            });
	            
	          //  event.find({patient: user._id, completed:false}, function(err, events){
	          //  	if(err){
	          //  		console.log(err);
	        		// 	// socket.emit(err);
	        		// }
	        		// if(events)
	        		// {
	        		// 	console.log("These are our incomplete events:");
	        		// 	console.log(events);
	        		// }
	          //  });
	        }else
	        {
	        	var wrongEmailMsg = {
    						"message" : "No user associated with the provided email of " + data.email + " was found!"
    					};
    					
    					socket.emit("login-failed",wrongEmailMsg);
    					
    					
	        }
	    });
	});
	
	socket.on('exercise-data',function(data){
	    console.log('Data received');
	    console.log(data);
	    
	    // user.findOne({email: data.email}, function(err, user){
	    //     if(err){
	    //         console.log(err);
	    //       // socket.emit(err);
	    //     }
	    //     if(user){
	    //         console.log(user);
	    //         socket.emit("login-response",user);
	    //     }
	    // });
	});
	
	socket.on('peekaboo', function(data){
		console.log(data);
		
		console.log("Let's try searching by string ID...");
		user.findOne({_id: data.patientID}, function(err, user){
	        if(err){
	            console.log(err)
	           // socket.emit(err);
	        }
	        if(user){
	            console.log("Succesfully found " + user.name);
	        }
	    });
	    
	    console.log("Now by exercise ID...");
	    event.findOne({_id: data.exerciseID}, function(err, event){
	        if(err){
	            console.log(err)
	           // socket.emit(err);
	        }
	        if(event){
	            console.log("Succesfully found " + event.date);
	        }
	    });
	})
	
}