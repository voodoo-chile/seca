var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var Menu = require('menu');
var ipc = require('ipc');
var UserFile = require('./app/userFile');
var userFile = new UserFile();

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});


// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  
  var template = [
    {
      label: 'SECA',
      submenu: [
        {
          label: 'Quit',
          accelerator: 'CommandOrControl+Q',
          click: function(item, window) { app.quit(); }
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CommandOrControl+R',
          click: function(item, window) { window.restart(); }
        },
        {
          label: 'Enter Fullscreen',
          click: function(item, window) { window.setFullScreen(true); }
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+CommandOrControl+I',
          click: function(item, window) { window.toggleDevTools(); }
        },
      ]
    },
  ];

  var menu = Menu.buildFromTemplate(template);
  app.setApplicationMenu(menu);

  ipc.on('getDataPath', function (event) {
    var path = app.getPath('userData');
    event.returnValue = path;
  });

  ipc.on('getUserList', function (event) {
    userFile.list(app.getPath('userData'), function (files) {
      var users = [];
      files.forEach(function (file) {
        var userName = file.split('seca/')[1];
        var extensionPosition = userName.indexOf('.user');
        userName = userName.substring(0, extensionPosition);
        users.push(userName);
      });
      event.returnValue = users;
    });
  });

  ipc.on('getUserData', function (event, userName, password) {
    userFile.open(app.getPath('userData'), userName, password, function (userObject) {
      event.returnValue = userObject;
    })
  })

  ipc.on('createNewUser', function (event, userName, password) {
    userFile.newUser(app.getPath('userData'), userName, password);
  });

  ipc.on('createNewRole', function (event, roleName, displayName) {
    console.log('rolename will be: ' + roleName);
    console.log('displayname will be: ' + displayName);
    userFile.addRole(roleName, displayName);
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800, 
    height: 600,
    'web-preferences': {
      javascript: true
    }
  });

  // and load the html of the app.
  if (process.argv[2] === 'test') {
    mainWindow.loadUrl('file://' + __dirname + '/test/mocha/static/index.html');
  } else {
   mainWindow.loadUrl('file://' + __dirname + '/browser/index.html'); 
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});