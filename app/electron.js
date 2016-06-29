'use strict'

const electron = require('electron')
const path = require('path')
const fs = require('fs')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

//Lets require/import the HTTP module
var http = require('http');

//Lets define a port we want to listen to
const PORT=52308; 

//We need a function which handles requests and send response
function handleRequest(request, response){
  if (request.url === "/") {
    var filePath = path.join(__dirname, '/dist/index.html');
    var stat = fs.statSync(filePath);

    response.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': stat.size
    });

    var readStream = fs.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(response);
  }

  if(request.url === "/build.js") {
    var filePath = path.join(__dirname, '/dist/build.js');
    var stat = fs.statSync(filePath);

    response.writeHead(200, {
        'Content-Type': 'text/javascript',
        'Content-Length': stat.size
    });

    var readStream = fs.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(response);
  }
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT);

let mainWindow
let config = {}

if (process.env.NODE_ENV === 'development') {
  config = require('../config')
  config.url = `http://localhost:${config.port}`
} else {
  config.devtron = false
  config.url = `file://${__dirname}/dist/index.html`
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 500,
    width: 320,
    autoHideMenuBar: true,
    resizable: false
  })

  mainWindow.loadURL("http://localhost:52308")
  if (process.env.NODE_ENV === 'development') mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (config.devtron) BrowserWindow.addDevToolsExtension(path.join(__dirname, '../node_modules/devtron'))
  else BrowserWindow.removeDevToolsExtension('devtron')

  console.log('mainWindow opened')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
