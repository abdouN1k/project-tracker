const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Test route باش نتأكدو السيرفر خدام
app.get('/', (req, res) => {
  res.json({ message: 'CoSider Agrico UEV API is running', status: 'OK' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', routes: ['/api/auth', '/api/projects', '/api/users', '/api/chat'] });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch((err) => console.error('Erreur MongoDB:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/users', require('./routes/users'));
app.use('/api/chat', require('./routes/chat'));

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', (userId) => {
    if (userId) socket.join(String(userId));
  });

  socket.on('sendMessage', (data) => {
    if (data?.receiverId) {
      io.to(String(data.receiverId)).emit('newMessage', data.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur CoSider Agrico UEV sur le port ${PORT}`);
});