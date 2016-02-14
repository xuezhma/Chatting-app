// TODO:
//	More Emojis!
//	email configuration	on new user
//	offline message box
const PORT = process.env.PORT || 3000
const express = require('express')
const app = express()
app.set('trust proxy', 1)
// session
const sessions = require('client-sessions')
app.use(sessions({
  cookieName: 'mySession', // cookie name dictates the key name added to the request object
  secret: 'anotherflyingkitten', // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}))

const http = require('http').Server(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')
app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}))

const moment = require('moment')

// added mongoDB and mongoose
const mongoose = require('mongoose')

mongoose.connect('mongodb://xuezhma:123@ds045785.mongolab.com:45785/chat', function (err) {
  if (err) throw err
})

// Schema collection:
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId

const messageSchema = new Schema({
  email: String,
  font: String,
  room: String,
  name: String,
  text: String,
  timestamp: Number
})

const userSchema = new Schema({
  email: String,
  password: String,
  name: String,
  url: String,    //avatar img
  active: String,
  rank: String
})

const messageObject = mongoose.model('message', messageSchema)
const userObject = mongoose.model('user', userSchema)

app.use(express.static(__dirname + '/public'))

// Socket.io for chat.html starts here
var clientInfo = {}

// user commands starts here
function sendHelp (socket) {
  socket.emit('message', {
    name: 'System',
    // remember to change this line to ES6 in the future
    text: '<strong>Current commands:</strong></p>\
		<ul><li> type "/currentUsers" for the names of current user in your chat room</li>\
		<li>type "/clear" to clear the chat</li>\
		<li>type "/roomHis" to display the message history of your current room.</li>\
		<li>type "/myHis" to display the message history of your current display name.</li>\
		<li> More commands are on the way!</p></li>',
    timestamp: moment().valueOf()
  })
}

function sendCurrentUsers (socket) {
  var info = clientInfo[socket.id]
  var users = []

  if (typeof info === 'undefined') {
    return
  }
  Object.keys(clientInfo).forEach(function (socketId) {
    var userInfo = clientInfo[socketId]
    if (info.room === userInfo.room) {
      users.push(userInfo.name)
    }
  })

  socket.emit('message', {
    name: 'System',
    text: 'current Users: ' + users.join(', '),
    timestamp: moment().valueOf()
  })
}

function sendClear (socket) {
  socket.emit('message', {
    name: 'System',
    text: '/clear',
    timestamp: moment().valueOf()
  })
}

function sendRoomHis (socket) {
  messageObject.find({
    room: clientInfo[socket.id].room

  }, function (err, messages) {
    if (err) throw err

    console.log(messages)

    socket.emit('message', {
      name: 'System',
      text: '/clear',
      timestamp: moment().valueOf()
    })

    socket.emit('message', {
      name: 'System',
      text: 'There is the message history of this chat room.',
      timestamp: moment().valueOf()
    })

    for (var i = 0; i < messages.length; i++) {
      socket.emit('message', messages[i])
    }
  })
}

function sendMyHis (socket) {
  messageObject.find({
    name: clientInfo[socket.id].name

  }, function (err, messages) {
    if (err) throw err

    console.log(messages)

    socket.emit('message', {
      name: 'System',
      text: '/clear',
      timestamp: moment().valueOf()
    })

    socket.emit('message', {
      name: 'System',
      text: 'There is the message history of your current display name',
      timestamp: moment().valueOf()
    })

    for (var i = 0; i < messages.length; i++) {
      messages[i].name = 'At Room ' + messages[i].room
      socket.emit('message', messages[i])
    }
  })
}

// user commands end here
io.on('connection', function (socket) {
  console.log('User connected via socket!')

  socket.on('disconnect', function () {
    var userData = clientInfo[socket.id]
    if (typeof userData !== 'undefined') {
      socket.leave(userData.room)
      io.to(userData.room).emit('message', {
        name: 'System',
        text: userData.name + ' has left!',
        timestamp: moment().valueOf()
      })
      delete clientInfo[socket.id]
    }
  })

  socket.on('joinRoom', function (req) {
    clientInfo[socket.id] = req
    socket.join(req.room)
    socket.broadcast.to(req.room).emit('message', {
      name: 'System',
      text: req.name + ' has joined!',
      timestamp: moment().valueOf()
    })
  })

  socket.on('message', function (message) {
    console.log('Message receieved: ' + message.text + ' Time: ' + moment.utc(moment().valueOf()).format('YYYY MMM Do, h:mm:ss'))

    if (message.text === '/currentUsers') {
      sendCurrentUsers(socket)
    } else if (message.text === '/help') {
      sendHelp(socket)
    } else if (message.text === '/clear') {
      sendClear(socket)
    } else if (message.text === '/roomHis') {
      sendRoomHis(socket)
    } else if (message.text === '/myHis') {
      sendMyHis(socket)
    } else {
      message.timestamp = moment().valueOf()
      // Emojis on the way!
      // Bringing a little Kappa to you everyday
      while (message.text.indexOf('KappaPride') !== -1 || message.text.indexOf('kappapride') !== -1) {
        message.text = message.text.replace('KappaPride', '<img src="https://static-cdn.jtvnw.net/emoticons/v1/55338/1.0">')
        message.text = message.text.replace('kappapride', '<img src="https://static-cdn.jtvnw.net/emoticons/v1/55338/1.0">')
      }
      while (message.text.indexOf('Kappa') !== -1 || message.text.indexOf('kappa') !== -1) {
        message.text = message.text.replace('Kappa', '<img src="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0">')
        message.text = message.text.replace('kappa', '<img src="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0">')
      }
      io.to(clientInfo[socket.id].room).emit('message', message)
      // socket.broadcast.emit('message',message)

      var randomMessage = messageObject({
        room: clientInfo[socket.id].room,
        name: clientInfo[socket.id].name,
        text: message.text,
        timestamp: message.timestamp,
        email: clientInfo[socket.id].email
      })
      console.log(randomMessage)
      randomMessage.save(function (err) {
        if (err) throw err

        console.log('message saved!')
      })
    }
  })

  socket.emit('message', {
    name: 'System',
    text: 'Welcome!</p><p> Type <strong> "/help" </strong> for user commands!',
    timestamp: moment().valueOf()
  })
})
// Socket ends here

// RESTful API Starts here

// check if a display name is avaiable
app.post('/displayname', function (req, res) {
  var name = req.body.name
  console.log(req.body.name)
  userObject.find({
    name: name
  }, function (err, founduser) {
    if (err) throw err

    if (founduser.length > 0) {
      console.log(founduser)
      console.log('unavailable')
      res.status(200).send('unavailable')
    } else {
      console.log('avaiable')
      res.status(200).send('available')
    }
  })
})

// user avator img url
app.post('/updateUrl', function (req, res) {
  const url = req.body.url
  userObject.findOne({
    email: req.mySession.email
  }, function (err, founduser) {
    if (err) throw err

    if (founduser) {
      founduser.url = url
      founduser.save(function (err) {
        if (err) throw err

        console.log('url saved!')
      })
    }
  })

  res.status(200).json(url)
})

// get user info from client session
app.get('/welcome', function (req, res) {
  var session = req.mySession
  console.log('get:')
  console.log(session)
  res.status(200).json(session)
})

// get user message history
app.get('/history', function (req, res) {
  const email = req.mySession.email
  messageObject.find({
    email: email
  }, function (err, foundmessages) {
    if (err) throw err

    if (foundmessages) {
      //console.log(foundmessages);
      res.status(200).send(foundmessages)
    }
  })
})

// for new user signup
app.post('/signup', function (req, res) {
  var body = req.body

  userObject.findOne({
    email: body.email
  }, function (err, founduser) {
    if (err) throw err

    if (founduser) {
      res.status(200).send('<script>alert("Sorry, the email is already used."); window.location.href = "/#/signup"</script>')
    } else {
      var newUser = userObject({
        email: body.email,
        password: body.password,
        active: 'yes',
        rank: 'user'
      })

      newUser.save(function (err) {
        if (err) throw err

        console.log('new user saved!')
        res.status(200).sendFile('/public/signedup.html', {root: __dirname})
      })
    }
  })
})

// for welcome.html
// declear a unique name as a registered user's pork

app.post('/newname', function (req, res) {
  var body = req.body
  var name = body.name
  var session = req.mySession
  console.log('session!!:')
  console.log(session)
  userObject.findOne({
    email: session.email
  }, function (err, founduser) {
    if (err) throw err

    founduser.name = name

    founduser.save(function (err) {
      if (err) throw err

      console.log('updated displayname!')
    })

    var tosend = '<script>alert("Displayname updated."); window.location.href = "welcome.html"</script>'

    res.status(200).send(tosend)
  })
})

// change password
app.post('/newpassword', function (req, res) {
  var body = req.body
  var oldpassword = body.oldpassword
  var newpassword = body.newpassword
  var session = req.mySession
  console.log('session!!:')
  console.log(session)
  userObject.findOne({
    email: session.email,
    password: oldpassword
  }, function (err, founduser) {
    console.log(founduser)
    if (err) throw err
    if (founduser == null) {
      var tosend = '<script>alert("Wrong password."); window.location.href = "welcome.html"</script>'

      res.status(200).send(tosend)
    } else {
      founduser.password = newpassword

      founduser.save(function (err) {
        if (err) throw err

        console.log('updated password!')
        var tosend = '<script>alert("Password updated."); window.location.href = "welcome.html"</script>'

        res.status(200).send(tosend)
      })
    }
  })
})

// for user sign in, put his info into sessions of both server and client
app.post('/login', function (req, res) {
  var body = req.body
  var email = body.email
  var password = body.password

  userObject.find({
    email: email,
    password: password
  }, function (err, users) {
    if (err) throw err

    // console.log(users)

    if (users.length === 1 && users[0].password === password) {
      console.log('user info correct. should login')
      req.mySession = users[0]
      var tosend = '<script>window.location.href = "welcome.html"</script>'

      res.status(200).send(tosend)
    // res.sendFile('/public/welcome.html?email='+sess.user.email, {root: __dirname})
    } else {
      res.status(200).send('<script>alert("Sorry, invaild login."); window.location.href = "/#/login"</script>')
    }
  })
})

http.listen(PORT, function () {
  console.log('Server started!')
})
