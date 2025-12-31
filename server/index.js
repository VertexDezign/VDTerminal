const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const chokidar = require('chokidar');
const { XMLParser } = require('fast-xml-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;
const XML_FILE_PATH = path.join('c:','Users','benjamin','Documents','My Games','FarmingSimulator2025', 'gameGlassInterface.xml');

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: ""
});

function parseAndEmit(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const xmlData = fs.readFileSync(filePath, 'utf8');
      const jsonObj = parser.parse(xmlData);
      io.emit('ggi-data', jsonObj);
      console.log('Emitted GGI data at', new Date().toLocaleTimeString());
    } else {
      console.error('File not found:', filePath);
    }
  } catch (error) {
    console.error('Error parsing XML:', error);
  }
}

// Watch for changes
const watcher = chokidar.watch(XML_FILE_PATH, {
  persistent: true,
});

watcher.on('change', (path) => {
  console.log(`File ${path} has been changed`);
  parseAndEmit(path);
});

watcher.on('add', (path) => {
  console.log(`File ${path} has been added`);
  parseAndEmit(path);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  // Send initial data
  parseAndEmit(XML_FILE_PATH);
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Watching file: ${XML_FILE_PATH}`);
});
