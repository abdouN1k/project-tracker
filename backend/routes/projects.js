const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// GET all projects
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('owner', 'name email role')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE project
router.post('/', auth, async (req, res) => {
  try {
    const { ntProjet, title, montant, duree, dateDemarrage, description, status, category, articles } = req.body;

    const project = new Project({
      ntProjet,
      title,
      montant,
      duree,
      dateDemarrage,
      description,
      status: status || 'En cours',
      category: category || 'Général',
      articles: articles || [],
      owner: req.user.id || req.user._id
    });

    await project.save();
    const populated = await Project.findById(project._id).populate('owner', 'name email role');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Projet introuvable' });

    // Pour simplifier, seul le propriétaire (ou le directeur) peut supprimer
    await project.deleteOne();
    res.json({ message: 'Projet supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;