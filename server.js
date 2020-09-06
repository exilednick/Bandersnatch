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

connections = [];
rooms={};

server.listen(PORT);
console.log('Server running');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
})

io.on('connection', socket => {
  connections.push(socket.id);
  console.log("Connected : %s sockets connected", connections.length);

  socket.on('join', params => {
    room = params['id'];
    socket.join(room);

    if(room in rooms) {
      rooms[room].push({'id': socket.id, 'name': params['name']});
    }
    else {
      rooms[room] = [{'id': socket.id, 'name': params['name']}] ;
    }

    io.in(room).emit('userJoined', rooms[room]);

    console.log(rooms);
  })

  socket.on("disconnect", data => {
    connections.splice(connections.indexOf(socket.id,1));

    let roomName;
    for(let i in rooms) {
          let index = rooms[i].findIndex(x => x.id == socket.id);
          if(index!=-1){
            roomName = i;
            rooms[i].splice(index,1);
            break;
          }
    }
    io.in(roomName).emit('userJoined', rooms[roomName]);
    console.log("Disconnected : %s sockets connected", connections.length);
    console.log(rooms);
  })

  socket.on('send message', (data, removed, index, room) => {
    socket.broadcast.to(room).emit('new message', {msg:data, removed: removed, index: index});
  })
})
