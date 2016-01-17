var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http); 
var bodyParser = require('body-parser')
// app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var session = require('express-session');

var moment = require('moment');

// added mongoDB and mongoose
var mongoose = require('mongoose');

mongoose.connect('mongodb://xuezhma:123@ds045785.mongolab.com:45785/chat', function(err) {
    if (err) throw err;
});

// Schema collection:
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var messageSchema = new Schema({
	room: String,
	name: String,
	text: String,
	timestamp: Number
});

var userSchema = new Schema({
	email: String,
	password: String,
	name: String,
	active: String,
	rank: String
});

var messageObject = mongoose.model('message', messageSchema);
var userObject = mongoose.model('user', userSchema);


app.use(express.static(__dirname + '/public'));

// Socket.io for chat.html starts here 
var clientInfo = {};

//user commands starts here
function sendHelp(socket){
	socket.emit('message', {
		name: 'System',
		text: '<strong>Current commands:</strong></p>\
		<ul><li> type "/currentUsers" for the names of current user in your chat room</li>\
		<li>type "/clear" to clear the chat</li>\
		<li>type "/roomHis" to display the message history of your current room.</li>\
		<li>type "/myHis" to display the message history of your current display name.</li>\
		<li> More commands are on the way!</p></li>',
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

function sendRoomHis(socket){
	messageObject.find({
		room: clientInfo[socket.id].room

	},function(err, messages){
		if(err) throw err;

		console.log(messages);

		socket.emit('message', {
			name: 'System',
			text: '/clear',
			timestamp: moment().valueOf()
		});

		socket.emit('message', {
			name: 'System',
			text: 'There is the message history of this chat room.',
			timestamp: moment().valueOf()
		});

		for (var i = 0; i < messages.length; i++) {
			socket.emit('message', messages[i]);
		};
		
	});
}

function sendMyHis(socket){
	messageObject.find({
		name: clientInfo[socket.id].name

	},function(err, messages){
		if(err) throw err;

		console.log(messages);

		socket.emit('message', {
			name: 'System',
			text: '/clear',
			timestamp: moment().valueOf()
		});

		socket.emit('message', {
			name: 'System',
			text: 'There is the message history of your current display name',
			timestamp: moment().valueOf()
		});

		for (var i = 0; i < messages.length; i++) {
			messages[i].name = "At Room " + messages[i].room;
			socket.emit('message', messages[i]);
		};
		
	});
}

// user commands end here
io.on('connection', function(socket){
	
	
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
		}else if(message.text === '/roomHis'){
			sendRoomHis(socket);
		}else if(message.text === '/myHis'){
			sendMyHis(socket);
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
		text: 'Welcome!</p><p> Type <strong> "/help" </strong> for user commands!',
		timestamp: moment().valueOf()
	});


	
});
// Socket ends here

// RESTful API Starts here

// for signup.html
app.post('/signup', function(req, res){

	var body = req.body;
	var newUser = userObject({
		email: body.email,
		password: body.password,
		active:'yes',
		rank: 'user'
	});

	newUser.save(function(err){
		if(err) throw err;

		console.log("new user saved!");
		res.sendFile('/public/signedup.html', {root: __dirname});
	});

});

// for login.html
// check if user has a unique display yet

app.post('/login', function(req, res){

	var body = req.body;
	var email = body.email;
	var password = body.password;

	userObject.find({
		email: email,
		password: password
	}, function(err, users){
		if(err) throw err;

		console.log(users);

		if(users.length == 1 && users[0].password == password){
			console.log("user info correct. should login");
			//put user object in session
			
			res.sendFile('/public/welcome.html', {root: __dirname});
		}

	});


});











http.listen(PORT, function(){
	console.log('Server started!');
});