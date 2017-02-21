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
	           // socket.emit(err);
	        }
	        if(user){
	            console.log(user);
	            socket.emit("login-response",user);
	            
	            event.find({patient: user._id, completed:false}, function(err, events){
	            	if(err){
	            		console.log(err);
	        			// socket.emit(err);
	        		}
	        		if(events)
	        		{
	        			console.log("These are our incomplete events:");
	        			console.log(events);
	        		}
	            });
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