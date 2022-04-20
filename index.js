// creating express instance
var express = require("express");
var app = express();
require('dotenv').config()
// creating http instance
var http = require("http").createServer(app);

// creating socket io instance
var io = require("socket.io")(http, {
   cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
   }
});

var users = [];
var devices = [];
// app.use(function (req, res, next) {

//    // Website you wish to allow to connect
//    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

//    // Request methods you wish to allow
//    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//    // Request headers you wish to allow
//    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//    // Set to true if you need the website to include cookies in the requests sent
//    // to the API (e.g. in case you use sessions)
//    res.setHeader('Access-Control-Allow-Credentials', true);

//    // Pass to next layer of middleware
//    next();
// });
app.get('/', function (req, res) {
   res.send("app is running");
})
app.get('/get_user_online', (req, res) => {
   // here we will show users show users online
   try {
      usersOnline = [];
      var keyToBeRemoved = Object.keys(users).find(key => {
         user.push(key);
      });
      return res.status(200).json(
         {
            status: 1,
            message: 'success',
            data: usersOnline,
         }
      );
   }
   catch (e) {
      res.status(401).json({
         status: 0,
         error: e
      });
   }
})
io.on("connection", function (socket) {

   console.log("User connected", socket.id);
   // attach incoming listener for new user
   socket.on("user_connected", function (username) {
      // save in array
      users[username] = socket.id;
      // socket ID will be used to send message to individual person
      // notify all connected clients
      console.log(users);
      console.log('System updated')
      io.emit("user_connected", username);
   });

   socket.on("message", function (data) {
      console.log(data);

      var socketId = users[data.reviever];
      if (socketId !== undefined) {
         io.to(socketId).emit('message', data)
      }
   });

   socket.on("typing", function (data) {
      var socketId = users[data.reviever];
      io.to(socketId).emit('typing', true)
   });

   socket.on("read_recipts", function (data) {
      var socketId = users[data.reviever];
      io.to(socketId).emit('read_recipts', true)

   })

   socket.on('disconnect', () => {
      var keyToBeRemoved = Object.keys(users).find(key => users[key] === socket.id);
      console.log(keyToBeRemoved);
      console.log(users);
      if (users[keyToBeRemoved] !== undefined) {
         delete users[keyToBeRemoved];
      }
      console.log(users);

   });
});

// start the server
http.listen(process.env.PORT, function () {
   console.log(`server started at ${process.env.PORT}`);
});