// TODO:
//	Improve English-To-Emoji module
//	email configuration	on new user
//	offline message box
//  tell if a mail or a chat message is spam
//  admin functions
const emoji = require('./English-To-Emoji') // less words === more fun
const translate = emoji.translate
const listMemes = emoji.listMemes
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
  reportedAbuse: Array,
  email: String,
  password: String,
  name: String,
  url: String,    //avatar img
  active: String,
  rank: String
})

const mailSchema = new Schema({
  read: Boolean,
  readableInbox: Boolean,
  readableSent: Boolean,
  fromEmail: String,  // sender's email
  fromName: String,   // sender's name at that time
  toEmail: String,    // reciever's name at that time
  toName: String,     // reciever's email
  subject: String,
  content: String,
  timestamp: Number
})

const messageObject = mongoose.model('message', messageSchema)
const userObject = mongoose.model('user', userSchema)
const mailObject = mongoose.model('mail', mailSchema)

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

function sendMemeList (socket) {
  socket.emit('message', {
    name: 'System',
    text: `<h5>Here is our current meme collection, type its name to use.</h5> ${listMemes()}`,
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
    } else if (message.text === '/memeList') {
      sendMemeList(socket)
    } else {
      message.timestamp = moment().valueOf()

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

      // Improvements on the way!
      message.text = translate(message.text)
      io.to(clientInfo[socket.id].room).emit('message', message)
      // socket.broadcast.emit('message',message)
    }
  })

  socket.emit('message', {
    name: 'System',
    text: `Welcome!</p><p> Type <strong> "/help" </strong> for user commands!</p><p> Type <strong>"/memeList"</strong> for meme collection!<img src="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0">`,
    timestamp: moment().valueOf()
  })
})
// Socket ends here

// RESTful API Starts here

// check if a display name is avaiable
app.post('/displayname', function (req, res) {
  var name = req.body.name
  userObject.find({
    name: name
  }, function (err, founduser) {
    if (err) throw err

    if (founduser.length > 0) {
      res.status(200).send('unavailable')
    } else {
      res.status(200).send('available')
    }
  })
})

// user avator img url
app.post('/updateUrl', function (req, res) {
  const url = req.body.url
  // remember to update session
  req.mySession.url = url
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
        reportedAbuse: [],
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

// log out, distory session
app.get('/logout', function (req, res) {
  delete req.mySession.email   // module doesn't allow setting session to non-object
  res.status(200).send();
})

// for user sign in, put his info into session
app.post('/login', function (req, res) {
  var tosend = '<script>window.location.href = "welcome.html"</script>'
  if (typeof(req.mySession.email) === undefined) {
    res.status(200).send(tosend)
  } else {
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

        res.status(200).send(tosend)
      // res.sendFile('/public/welcome.html?email='+sess.user.email, {root: __dirname})
      } else {
        res.status(200).send('<script>alert("Sorry, invaild login."); window.location.href = "/#/login"</script>')
      }
    })
  }
})

// mailbox services start here:

// compose
app.post('/compose', function (req, res) {
  const body = req.body
  const session = req.mySession
  userObject.findOne({
    name: body.name
  }, function (err, founduser) {
    if (err) throw err

    if (founduser) {
      const newMail = mailObject({
        read: false,
        readableInbox: true,
        readableSent: true,
        fromEmail: session.email,
        fromName: session.name,
        toEmail: founduser.email,
        toName: body.name,
        subject: body.subject,
        content: body.content,
        timestamp: moment().valueOf()
      })

      newMail.save(function (err) {
        if (err) throw err

        console.log('new mail saved!: ', newMail)
        res.status(200).send()
      })

    } else {
      res.status(404).send()
    }
  })
})

// inbox
// fires in $scope.init and every a while (determined by user)
app.get('/inbox', function (req, res) {
  mailObject.find({
    readableInbox: true,
    toEmail: req.mySession.email
  }, function (err, foundMails) {
    if (err) throw err

    if (foundMails) {
      //console.log(foundMails)
      res.status(200).json(foundMails)
    }
  })
})

// sent
// fires only in $scope.init
app.get('/sent', function (req, res) {
  mailObject.find({
    readableSent: true,
    fromEmail: req.mySession.email
  }, function (err, foundMails) {
    if (err) throw err

    if (foundMails) {
      
      res.status(200).json(foundMails)
    }
  })
})

// update read mail
app.post('/updateMail', function (req, res) {
  mailObject.findOne({
    _id: req.body.mailID
  }, function (err, foundMail) {
    if (err) throw err

    if (foundMail) {
      foundMail.read = true
      foundMail.save(function (err) {
        if (err) throw err

        console.log('updated read mail')
      })
    }
  })
  res.status(200).json()
})

// disable a mail appear in inbox
app.post('/deleteInboxMail', function (req, res) {
  mailObject.findOne({
    _id: req.body.mailID
  }, function (err, foundMail) {
    if (err) throw err

    if (foundMail) {
      foundMail.readableInbox = false
      foundMail.save(function (err) {
        if (err) throw err

        console.log('this mail is no longer in inbox')
      })
    }
    res.status(200).json()
  })
})

// disable a mail appear in sent
app.post('/deleteSentMail', function (req, res) {
  mailObject.findOne({
    _id: req.body.mailID
  }, function (err, foundMail) {
    if (err) throw err

    if (foundMail) {
      foundMail.readableSent = false
      foundMail.save(function (err) {
        if (err) throw err

        console.log('this mail is no longer in sent')
      })
    }
    res.status(200).json()
  })
})

// report abuse
app.post('/reportAbuse', function (req, res) {
  const mailID = req.body.mailID
  mailObject.findOne({
    _id: mailID
  }, function (err, foundMail) {
    if (err) throw err

    if (foundMail) {
      userObject.findOne({
        email: foundMail.fromEmail
      }, function (err, founduser) {
        if (err) throw err

        if(founduser) {
          founduser.reportedAbuse.push(mailID)

          founduser.save(function (err) {
            if (err) throw err

            console.log('this user is reported abuse')
          })
        }
      })
    }
    res.status(200).json()
  })
})


// mail services end here

// 404
app.get('*', function(req, res){
  res.status(200).sendFile('/public/pages/ops.html', {root: __dirname})
})

// RESTful APIs end here

http.listen(PORT, function () {
  console.log('Server started!')
})
