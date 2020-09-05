const express = require('express');
const app = express();
const PORT = 3000 || process.env.PORT;
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);

const subsRouter = require('./routes/subs')

app.set('views',__dirname+'/views');
app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use('/subs', subsRouter);
app.use(express.static('public'));


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

  socket.on('join', room => {socket.join(room);
    console.log(room);
  });

  socket.on("disconnect", data => {
    connections.splice(connections.indexOf(socket,1));
    console.log("Disconnected : %s sockets connected", connections.length);
  });

  socket.on('send message', (data, removed, index, room) => {
    socket.broadcast.to(room).emit('new message', {msg:data, removed: removed, index: index});
  });
});
