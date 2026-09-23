const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: { type: String, default: '' },
  type: {
    type: String,
    enum: ['text', 'rapport_journalier', 'attachement'],
    default: 'text'
  },
  reportData: { type: mongoose.Schema.Types.Mixed, default: null },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);