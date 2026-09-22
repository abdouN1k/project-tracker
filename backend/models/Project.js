const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['En cours', 'Terminé', 'En attente', 'Annulé'],
    default: 'En cours' 
  },
  category: {
    type: String,
    enum: ['Agriculture', 'Élevage', 'Irrigation', 'Général'],
    default: 'Général'
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);