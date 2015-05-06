var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var role = require('./role.js');
var glob = require('glob');

app.set('views', __dirname + '/lib/app/web/views');

app.get('/', function (req, res) {
  glob("data/*.user", {}, function (er, files) {
    if (er) {
      throw new Error(er);
    } else {
      if (files.length > 0) {
        res.sendFile(__dirname + '/lib/app/web/index.html');
      } else {
        res.sendFile(__dirname + '/lib/app/web/init.html');
      }
    }
  });
  
});

app.use('/web', express.static(__dirname+'/lib/app/web'));

io.on('connection', function (socket) {
  socket.on('chat message', function (data) {
    io.emit('chat message', data);
  });
  socket.on('typing', function (data) {
    io.emit('typing', data);
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});