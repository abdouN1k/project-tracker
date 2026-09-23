const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  ntProjet: { type: String, required: true }, // Numéro du projet
  title: { type: String, required: true }, // Intitulé du projet
  montant: { type: Number, required: true },
  duree: { type: String, required: true }, // ex: "12 Mois"
  dateDemarrage: { type: Date, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ['En cours', 'Terminé', 'En attente', 'Annulé'],
    default: 'En cours'
  },
  category: {
    type: String,
    default: 'Général'
  },
  // Tableau des articles (Désignations et Quantités)
  articles: [{
    designation: { type: String, required: true },
    quantite: { type: Number, required: true }
  }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);