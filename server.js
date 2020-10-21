const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);

const indexRouter = require('./routes/index')

app.set('views',__dirname+'/views');
app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use('https://colab-editor.herokuapp.com/', indexRouter);
app.use('/', indexRouter);
connections = [];
rooms={};
app.get('/join', (req,res) => {
  let roomName = req.query['id'];
  if(roomName in rooms) {
    res.send("Room already exists");
  }
  else {
    res.render('editor');
  }
});
server.listen(PORT);
console.log('Server running');
let cnt = 0;

io.on('connection', socket => {
  cnt+=1;
  connections.push(socket.id);
  console.log("Connected : %s sockets connected", connections.length);

  socket.on('join', params => {
    room = params['id'];
    socket.join(room);
    socket.emit('getId', cnt);

    if(room in rooms) {
      rooms[room].push({'id': socket.id, 'name': params['name']});
    }
    else {
      rooms[room] = [{'id': socket.id, 'name': params['name']}] ;
    }

    io.in(room).emit('userJoined', rooms[room]); //send list of all users

    if(rooms[room].length>1) {
      io.to(rooms[room][0]['id']).emit('send_data'); //take data from the first member
    }

    socket.on('get_data', data => {
      io.to(rooms[room][rooms[room].length -1]['id']).emit('take_data', data);
    }) //send data to the new user
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
    if(rooms[roomName].length == 0)
      delete rooms[roomName];
    io.in(roomName).emit('userJoined', rooms[roomName]); //send list of all users
    console.log("Disconnected : %s sockets connected", connections.length);
    console.log(rooms);
  })

  socket.on('send message', (inserted, deleted, index, room) => {
    socket.broadcast.to(room).emit('new message', {insert:inserted, delete: deleted, index: index});
  })
})
