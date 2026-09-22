const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { 'members.user': req.user._id }]
    })
    .populate('owner', 'name email')
    .populate('members.user', 'name email isOnline')
    .sort('-updatedAt');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }]
    });
    const populated = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email isOnline');
    if (!project) return res.status(404).json({ message: 'Project ma l9inahch' });

    const tasks = await Task.find({ project: project._id })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .sort('order');

    res.json({ project, tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/members', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project ma l9inahch' });

    const { userId, role } = req.body;
    const alreadyMember = project.members.find(m => m.user.toString() === userId);
    if (alreadyMember) return res.status(400).json({ message: 'Had user deja f project' });

    project.members.push({ user: userId, role: role || 'editor' });
    await project.save();

    const updated = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email isOnline');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;