var name = getQueryVariable('name') || 'Guest';
var room = getQueryVariable('room') || 'Public Room';
var socket = io();
console.log(name + " wants to join room: " + room);
socket.on('connect', function(){
	console.log('Connected to socket.io server!');
});

socket.on('message',function(message){
	var momentTimesstamp = moment.utc(message.timestamp);
	console.log('New message: ');
	console.log(message.text);
	var $message = jQuery('.messages');
	$message.append('<p><strong>'+ momentTimesstamp.local().format('h:mm a') + ' ' + message.name +': </strong></p>');
	$message.append('<p>' + message.text + '</p>');
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