const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

const onlineUsers = new Map();

const setupSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Khassek t connecta'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key_123456789');
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User ma l9inahch'));
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Token invalid'));
    }
  });

  io.on('connection', async (socket) => {
    onlineUsers.set(socket.user._id.toString(), socket.id);
    await User.findByIdAndUpdate(socket.user._id, { isOnline: true });
    io.emit('users:online', Array.from(onlineUsers.keys()));

    socket.on('chat:join', (conversationId) => {
      socket.join(conversationId);
    });

    socket.on('chat:leave', (conversationId) => {
      socket.leave(conversationId);
    });

    socket.on('chat:message', async (data) => {
      try {
        const { conversationId, content } = data;
        const message = await Message.create({
          conversation: conversationId,
          sender: socket.user._id,
          content
        });
        const populated = await Message.findById(message._id).populate('sender', 'name email');
        io.to(conversationId).emit('chat:message', populated);
      } catch (error) {
        socket.emit('chat:error', { message: error.message });
      }
    });

    socket.on('disconnect', async () => {
      onlineUsers.delete(socket.user._id.toString());
      await User.findByIdAndUpdate(socket.user._id, { isOnline: false, lastSeen: new Date() });
      io.emit('users:online', Array.from(onlineUsers.keys()));
    });
  });
};

module.exports = setupSocket;