var mongoose    = require('mongoose');
var gameData    = mongoose.model('gameData');
var user        = mongoose.model('User');

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
	            console.log(err)
	           // socket.emit(err);
	        }
	        if(user){
	            console.log(user);
	            socket.emit("login-response",user);
	        }
	    });
	});
	
	socket.on('peekaboo', function(data){
		console.log(data);
	})
	
}