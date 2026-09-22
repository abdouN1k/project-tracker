const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, createdBy: req.user._id });
    const populated = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');
    await updateProjectProgress(task.project);
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');
    await updateProjectProgress(task.project);
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task ma l9inahach' });
    const projectId = task.project;
    await task.deleteOne();
    await updateProjectProgress(projectId);
    res.json({ message: 'Task t7eydat b naja7' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function updateProjectProgress(projectId) {
  const tasks = await Task.find({ project: projectId });
  if (tasks.length === 0) {
    await Project.findByIdAndUpdate(projectId, { progress: 0 });
    return;
  }
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const progress = Math.round((doneTasks / tasks.length) * 100);
  await Project.findByIdAndUpdate(projectId, { progress });
}

module.exports = router;