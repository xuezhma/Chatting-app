var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http); 


app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
	console.log("User connected via socket!");

	socket.on('message', function(message){
		console.log('Message receieved: ' + message.text);
		//io.emit sends to everyone, socket.broadcast send to other users only;
		socket.broadcast.emit('message',message);
	});

	socket.emit('message', {
		text: 'Welcome to my chat app!'
	});


	
});

http.listen(PORT, function(){
	console.log('Server started!');
});