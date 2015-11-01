var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http); 

var moment = require('moment');

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
	console.log("User connected via socket!");

	socket.on('message', function(message){
		message.timestamp = moment().valueOf();
		console.log('Message receieved: ' + message.text + message.timestamp);
		io.emit('message',message);
		//socket.broadcast.emit('message',message);
	});

	socket.emit('message', {
		text: 'Welcome to my chat app!',
		timestamp: moment().valueOf()
	});


	
});

http.listen(PORT, function(){
	console.log('Server started!');
});