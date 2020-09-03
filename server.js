const express = require('express');
const app = express();
const PORT = 3000 || process.env.PORT;
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server running');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
  connections.push(socket);
  console.log("Connected : %s sockets connected", connections.length);

  socket.on("disconnect", data => {
    connections.splice(connections.indexOf(socket,1));
    console.log("Disconnected : %s sockets connected", connections.length);
  });

  socket.on('send message', (data, removed, index) => {
    socket.broadcast.emit('new message', {msg:data, removed: removed, index: index})
  })
});

app.use(express.static('public'));
