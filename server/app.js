const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});

io.on('connection', (socket) => {

  console.log('A user connected');
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });

  socket.on('join', function(data) {
      socket.join(data.room);
      console.log(data.user + ' joined the room '+data.room);
      socket.broadcast.to(data.room).emit('new user joined', {user:data.user, message:'has joined this room'});
  });

  socket.on('leave', function(data) {
    console.log(data.user + ' left the room '+data.room);
    socket.broadcast.to(data.room).emit('left room', {user:data.user, message:'has left this room'});
    socket.leave(data.room);
  });

  socket.on('message', function(data) {
    io.in(data.room).emit('new message', {user:data.user, message:data.message});
  });

});

// io.on('connection', (socket) => {

//     socket.on('my message', (msg) => {
//         console.log(msg);
//       io.emit('my broadcast', `server: ${msg}`);
//     });

// });

http.listen(3000, () => {
  console.log('listening on :3000');
});