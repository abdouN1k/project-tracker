io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('sendMessage', ({ receiverId, message }) => {
    io.to(receiverId).emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});