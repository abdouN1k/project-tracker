const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// GET all projects (visible to everyone)
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email');
    if (!project) return res.status(404).json({ message: 'Projet introuvable' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE project
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status, category } = req.body;
    const project = new Project({
      title,
      description,
      status: status || 'En cours',
      category: category || 'Général',
      owner: req.user.id
    });
    await project.save();
    const populated = await Project.findById(project._id).populate('owner', 'name email');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE project (only owner)
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Projet introuvable' });
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    Object.assign(project, req.body);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE project (only owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Projet introuvable' });
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    await project.deleteOne();
    res.json({ message: 'Projet supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;