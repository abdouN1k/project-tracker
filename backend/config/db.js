const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Lien dyal MongoDB Atlas (wla fallback)
    const dbURI = process.env.MONGODB_URI || 'mongodb+srv://abdou14dida_db_user:2Oz3fR4Cks5W017k@cluster0.xlaygma.mongodb.net/?appName=Cluster0';
    
    const conn = await mongoose.connect(dbURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;