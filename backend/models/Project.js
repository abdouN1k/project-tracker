const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'editor' }
  }],
  status: { type: String, enum: ['planning', 'in-progress', 'review', 'completed', 'on-hold'], default: 'planning' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  startDate: { type: Date, default: Date.now },
  deadline: { type: Date },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  color: { type: String, default: '#4F46E5' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);