const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Middleware CORS pour autoriser Vercel, Localhost et toutes les origines
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Route racine de test
app.get('/', (req, res) => {
  res.json({ message: 'CoSider Agrico UEV API is running', status: 'OK' });
});

// Route Health Check pour vérifier l'état du serveur et la connexion DB
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    dbState: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    routes: ['/api/auth', '/api/projects', '/api/users', '/api/chat'] 
  });
});

// Connexion MongoDB Atlas avec Timeout
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://abdou14dida_db_user:2Oz3fR4Cks5W017k@cluster0.xlaygma.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
  .then(() => console.log('✅ MongoDB connecté avec succès'))
  .catch((err) => console.error('❌ Erreur de connexion MongoDB:', err.message));

// Attachement des routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/users', require('./routes/users'));
app.use('/api/chat', require('./routes/chat'));

// Configuration Socket.IO (Messages en temps réel)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Utilisateur connecté au socket:', socket.id);

  socket.on('joinRoom', (userId) => {
    if (userId) {
      socket.join(String(userId));
      console.log(`Socket ${socket.id} a rejoint le room : ${userId}`);
    }
  });

  socket.on('sendMessage', (data) => {
    if (data?.receiverId) {
      io.to(String(data.receiverId)).emit('newMessage', data.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté du socket:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur CoSider Agrico UEV démarré sur le port ${PORT}`);
});