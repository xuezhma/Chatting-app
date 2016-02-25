# Chatting-app
<h2>Introduction</h2>
<p>This project is a practice to my self-studying. I keep a to-do list on top of the server.js file, if anyone wanna grab.</p>
<p>It is a web-based real-time single-page chat app in node.js.</p>
<p>Most JavaScript code is now in ES6 style.</p>
<p>Demo on Heroku: https://safe-shore-4614.herokuapp.com/ </p>
<p>Used tools include: Express, AngularJS, Socket.io, MongoDB(with Mongoose on MongoLab), client-sessions, Moment.js, jQuery, and Bootstrap. See package.json for dependencies.</p>

<h2>Instruction for Developers</h2>

<p>0. Install the newest Node.js if it's not at v5.x</p>
<p>1. After download the repo, open folder in terminal and type 'npm install'</p>
<p>2. Type 'node server.js' in terminal to run the app.</p>
<p>3. Go to localhost:3000 on browser.</p>


<h2>Current Features for Users</h2>
<h3> For both guest users and registered users:</h3>
<p>Hidden Emojis in chat rooms!</p>
<p>Join different chat rooms with different usernames(as long as it's not being used by registered users) </p>
<p>Pass live messages with names and sent time within a chat room</P>
<p>Modify sent time to user's time zone</P> 
<p>User commands:</strong></p>\
		<ul>
		<li> type "/help" for the details of user commands</li>
		<li> type "/currentUsers" for the names of current user in your chat room</li>
		<li>type "/clear" to clear the chat</li>
		<li>type "/roomHis" to display the message history of your current room.</li>
		<li>type "/myHis" to display the message history of your current display name.</li>
		<li> More commands are on the way!</p></li></ul>
<h3> For registered users only:</h3>
<p> Claim a display name that will no longer avaiable to other users</p>
<p> Personal chat message history</P>
<p> Change password</p>
<p> Mail box</p>
<p> Avatar</p>

