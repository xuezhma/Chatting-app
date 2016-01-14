var PORT = process.env.PORT || 3001;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http); 

var moment = require('moment');

// added mongoDB and mongoose
var mongoose = require('mongoose');

mongoose.connect('mongodb://xuezhma:123@ds045785.mongolab.com:45785/chat', function(err) {
    if (err) throw err;
});

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var messageSchema = new Schema({
	room: String,
	name: String,
	text: String,
	timestamp: String
});

var messageObject = mongoose.model('message', messageSchema);

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

//user commands starts here
function sendHelp(socket){
	socket.emit('message', {
		name: 'System',
		text: '<strong>Current commands:</strong></p><p> type "/currentUsers" for the names of current user in your chat room</p><p>type "/clear" to clear the chat</p><p> More commands are on the way!',
		timestamp: moment().valueOf()
	});
}

function sendCurrentUsers(socket){
	var info = clientInfo[socket.id];
	var users = [];

	if (typeof info === 'undefined') {
		return;
	}
	Object.keys(clientInfo).forEach(function(socketId){
		var userInfo = clientInfo[socketId];
		if (info.room === userInfo.room){
			users.push(userInfo.name);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'current Users: ' + users.join(', '),
		timestamp: moment().valueOf()
	});
}

function sendClear(socket){
	socket.emit('message', {
		name: 'System',
		text: '/clear',
		timestamp: moment().valueOf()
	});
}


// user commands end here
io.on('connection', function(socket){
	messageObject.find({},function(err, messages){
		if(err) throw err;

		console.log(messages);
	})
	
	console.log("User connected via socket!");

	socket.on('disconnect',function(){
		var userData = clientInfo[socket.id];
		if (typeof userData !== 'undefined'){
			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left!',
				timestamp: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}
	});

	socket.on('joinRoom', function(req){
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined!',
			timestamp: moment().valueOf()
		});
	});


	socket.on('message', function(message){
		console.log('Message receieved: ' + message.text + " Time: " + moment.utc(moment().valueOf()).format('YYYY MMM Do, h:mm:ss'));

		if (message.text === '/currentUsers') {
			sendCurrentUsers(socket);
		}else if(message.text === '/help'){
			sendHelp(socket);
		}else if(message.text === '/clear'){
			sendClear(socket);
		}else{
			message.timestamp = moment().valueOf();
			io.to(clientInfo[socket.id].room).emit('message',message);
			//socket.broadcast.emit('message',message);

			var randomMessage = messageObject({
				room: clientInfo[socket.id].room,
				name: clientInfo[socket.id].name,
				text: message.text,
				timestamp: message.timestamp
			});

			randomMessage.save(function(err){
				if(err) throw err;

				console.log("message saved!");
			});
		}

		
	});

	socket.emit('message', {
		name: 'System',
		text: 'Welcome to my chat app!</p><p> Type "/help" for user commands!',
		timestamp: moment().valueOf()
	});


	
});

http.listen(PORT, function(){
	console.log('Server started!');
});