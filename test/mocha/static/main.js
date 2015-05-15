var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var Menu = require('menu');
var ipc = require('ipc');

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
      label: 'Atom',
      submenu: [
        {
          label: 'Quit',
          accelerator: 'CommandOrControl+Q',
          click: function(item, window) { app.quit(); }
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CommandOrControl+Z',
          selector: 'undo:',
        },
        {
          label: 'Redo',
          accelerator: 'CommandOrControl+Shift+Z',
          selector: 'redo:',
        },
        {
          type: 'separator',
        },
        {
          label: 'Cut',
          accelerator: 'CommandOrControl+X',
          selector: 'cut:',
        },
        {
          label: 'Copy',
          accelerator: 'CommandOrControl+C',
          selector: 'copy:',
        },
        {
          label: 'Paste',
          accelerator: 'CommandOrControl+V',
          selector: 'paste:',
        },
        {
          label: 'Select All',
          accelerator: 'CommandOrControl+A',
          selector: 'selectAll:',
        },
      ]
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
    {
      label: 'Window',
      submenu: [
        {
          label: 'Open',
          accelerator: 'CommandOrControl+O',
        },
        {
          label: 'Close',
          accelerator: 'CommandOrControl+W',
          click: function(item, window) { window.close(); }
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

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800, 
    height: 600,
    'web-preferences': {
      javascript: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});