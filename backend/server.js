const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// CORS autorise toutes les origines (Vercel, Localhost, etc.)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur Mongo:', err));

// Routes API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/users', require('./routes/users'));
app.use('/api/chat', require('./routes/chat'));

// Configuration Socket.IO avec CORS autorisant tout
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Utilisateur connecté:', socket.id);

  socket.on('joinRoom', (userId) => {
    socket.join(userId);
  });

  socket.on('sendMessage', (data) => {
    if (data.receiverId) {
      io.to(data.receiverId).emit('newMessage', data.message);
      io.to(data.message.sender._id || data.message.sender).emit('newMessage', data.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});