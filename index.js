var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
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
app.use('/vendor', express.static(__dirname+'/vendor'));
app.use('/bower_components', express.static(__dirname+'/bower_components'));
app.use('/node_modules', express.static(__dirname+'/node_modules'))


io.sockets.on('connection', function (socket) {
  socket.on('chat message', function (data) {
    io.emit('chat message', data);
  });
  socket.on('typing', function (data) {
    io.emit('typing', data);
  });
});

server.listen(process.env.PORT || 3000);