var express = require('express');
var app = express();
var server = module.exports = require('http').createServer(app);
var io = require('socket.io').listen(server);
var glob = require('glob');
var bodyParser = require('body-parser');
var fs = require('fs');
var ursa = require('ursa');
var displayName;

//app.use(express.cookieParser());
//app.use(express.session({secret: 'SECA is awesome!'}));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  glob("data/*.user", {}, function (er, files) {
    if (er) {
      throw new Error(er);
    } else {
      if (files.length > 0) {
        res.render('pages/index', {
          nick: displayName
        });
      } else {
        res.render('pages/firstUser');
      }
    }
  });
  
});

app.post('/user', function (req, res) {
  var userName = req.body.username;
  var fileName = "data/" + req.body.username + ".user";
  var userObject = {
    userName : req.body.username,
    roles : []
  }
  var plainText = JSON.stringify(userObject);
  fs.writeFile(fileName, plainText);
  res.render('pages/firstRole', {
    username: req.body.username
  });
});

app.post('/role', function (req, res) {
  var userFile = 'data/' + req.body.username + '.user';
  fs.readFile(userFile, 'utf8', function (er, data) {
    if (er) {
      throw new Error(er);
    } else {
      var userObject = JSON.parse(data);
      var keys = ursa.generatePrivateKey();
      var privPem = keys.toPrivatePem().toString();
      var pubPem = keys.toPublicPem().toString();
      var roleObject = {
        roleName: req.body.rolename, 
        displayName: req.body.displayname,
        keys: {
          privKey: privPem,
          pubKey: pubPem
        }
      }
      userObject.roles.push(roleObject);
      plainText = JSON.stringify(userObject);
      fs.writeFile(userFile, plainText);
    }
  })
  displayName = req.body.displayname;
  res.redirect('/');
});

app.use('/public', express.static(__dirname+'/../../public'));
app.use('/vendor', express.static(__dirname+'/../../vendor'));
app.use('/bower_components', express.static(__dirname+'/../../bower_components'));
app.use('/node_modules', express.static(__dirname+'/../../node_modules'))


io.sockets.on('connection', function (socket) {
  socket.on('chat message', function (data) {
    io.emit('chat message', data);
  });
  socket.on('typing', function (data) {
    io.emit('typing', data);
  });
});