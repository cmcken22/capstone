var mongoose    = require('mongoose');
var gameData    = mongoose.model('gameData');
var user        = mongoose.model('User');
var event        = mongoose.model('event');

console.log('sup');
module.exports.onConnection = function(socket){
    
    console.log('New Socket Connection');
    
    socket.on('post-gamedata',function(data)
    {
    	
    	console.log('hello hello');
    	
    	
    	//event.findOne(_id: data.eventID)
    	
    	
	    console.log(data);
	    console.log(data.canvasX);
	    
	    var newPost = new gameData();
	    newPost.patient = data.patientID;
	    
	    // event.findById(data.eventID, 
	    // function(err, test)
	    // {
	    // 	if(err) throw err;
	    // 	console.log('Did we find something: ' + test.exercise);
	    // 	newPost.exercise = test.exercise;
	    // });
	    newPost.date = Date.now();
	    newPost.timeStamp = data.timeStamp;
        newPost.exerciseDuration = data.timeStamp[data.timeStamp.length-1];
		newPost.canvasX = data.canvasX;
		newPost.canvasY = data.canvasY;
		newPost.pressureAxial = data.pressureAxial;
		newPost.pressureA = data.pressureA;
		newPost.pressureB = data.pressureB;
		newPost.pressureC = data.pressureC;
		newPost.penX = data.penX;
		newPost.penY = data.penY;
		newPost.penZ = data.penZ;
		newPost.penQw = data.penQw;
		newPost.penQx = data.penQx;
		newPost.penQy = data.penQy;
		newPost.penQz = data.penQz;
		
		console.log("Let's see if that worked...");
		console.log(newPost);
		
		// Make sure data corresponds to actual event
    	event.findById({_id: data.eventID}, function(err, event){
	        if(err){
	            console.log(err)
	           // socket.emit(err);
	        }
	        if(event)
	        {
	        	console.log('Succesfully found this event ' + event._id);
	        	
	        	newPost.exercise = event.exercise;
	        	
	        	console.log('TESTING ONCE AGAIN!');
	        	console.log(newPost);
	        	
	        	//If we find it, let's save it, then give it's ID to event, then save that
	        	newPost.save(function(err) 
	        	{
	        	    if(err)
	        	    {
	        	    	//Might be worth it to send a message back to Unity if we have time
            			console.log(err);
	        	    }else
	        	    {
	        	    	//Here we can now save the gameData to the corresponding event and mark
	        	    	//it as compelete.
	        	    	console.log('Debug test one');
	        	    	event.gameData = newPost._id;
	        	    	
	        	    	//!!!Remember to change this 
	        	    	event.completed = true;
	        	    	
	        	    	event.save(function(err) 
	        	    	{
	        	    		if(err)
	        	    		{
	        	    			//Again, may be worth doing something in here to notify Unity
	        	    			//something went wrong, low priority
	        	    		}else
	        	    		{
	        	    			
	        	    			console.log('Event should have saved');
	        	    	
			        	    	var check = mongoose.model('event');
			        	    	//Testing if the event actually saved and what it's doing
						    	check.findOne({_id: data.eventID},function(err,eventTest)
						        {
						        	if(err) throw err;
						        	console.log('Without populate....');
						        	console.log(eventTest);
						        	
						        	console.log('Checking if data is saved in object...');
						        	mongoose.model('gameData').findById(eventTest.gameData,
							        	function(err,dataTest)
							        	{
							        		if(err) throw err;
							        		else
							        			console.log(dataTest);
							        	});
						        });
						        
						    	check.find({_id: data.eventID}).populate('gameData').exec(function(err,eventTest)
						        {
						        	if(err) throw err;
						        	console.log('With populate....');
						        	console.log(eventTest);
						        });
	        	    		}
	        	    	});
	        	    	
	        	    	
	        	    }
	        	});
	        	
	        }
	    });
	    
	    	
	    
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
    					console.log('Thing retrieved:' + singleE);
    					if(singleE.exercise)
    					{
    						var exerciseData = {
    						"_id" : singleE._id,
    						"name" : singleE.exercise.name,
    						"description" : singleE.exercise.description,
    						"date" : singleE.date,
    						"endTime" : singleE.endTime,
    						"type" : singleE.type,
    						"eventDescription" : singleE.description,
    						};
    						socket.emit("exercise-data",exerciseData);
    					//console.log('The hell: ' + exerciseData);
    				
    					}
    					
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