var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var role = require('./role.js');
var glob = require('glob');
var bodyParser = require('body-parser');
var fs = require('fs');
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';

function encrypt (text, algorithm, password) {
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt (cipherText, algorithm, password) {
  var decipher = crypto.createDecipher(algorithm, password);
  var plainText = decipher.update(cipherText,'hex','utf8');
  plainText += decipher.final('utf8');
  return plainText;
}

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

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

app.post('/', function (req, res) {
  var userName = req.body.username;
  var fileName = "data/" + req.body.username + ".user";
  var userObject = {
    username : req.body.username
  }
  var plainText = JSON.stringify(userObject);
  var cipherText = encrypt(plainText, algorithm, req.body.password);
  fs.writeFile(fileName, cipherText);
  res.sendFile(__dirname + '/lib/app/web/firstrole.html');
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