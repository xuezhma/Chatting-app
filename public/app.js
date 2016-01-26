var name = getQueryVariable('name') || 'Guest';
var room = getQueryVariable('room') || 'Public Room';
var socket = io();
console.log(name + " wants to join room: " + room);
var $room = jQuery('.room-title');
$room.append(room);
//$room.text(room);
var connected = 0;
if(connected === 0){
	socket.on('connect', function(){
		console.log('Connected to socket.io server!');
		socket.emit('joinRoom', {
			name: name,
			room: room
		});
	});
	connected = 1;
	console.log('Connected: ');
	console.log(connected);
}


socket.on('message',function(message){
	var momentTimesstamp = moment.utc(message.timestamp);
	console.log('New message: ');
	console.log(message.text);
	var $messages = jQuery('.messages');
	var $message = jQuery('<li class="list-group-item"></li>');
	//user command /clear
	if(message.text === '/clear'){
		$messages.text(" ");
	}else{
		$message.append('<p>'+ momentTimesstamp.local().format('MMM Do, YYYY h:mm a') + ' </p><p><strong>' + message.name +': </strong></p>');
		$message.append('<p>' + message.text + '</p>');
		$messages.append($message);
	}
});

var $form = jQuery('#messgae-form');

$form.on('submit', function(event){
	event.preventDefault();
	var $message = $form.find('input[name=message]')
	socket.emit('message', {
		name: name,
		text: $message.val()
	});
	$form.find('input[name=message]').val('');

});