import mongoose from 'mongoose';
import Task from '../models/Task.js';

/**
 * @desc   Get all tasks for the authenticated user
 * @route  GET /api/tasks
 * @access Private
 */
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tasks'
    });
  }
};

/**
 * @desc   Get single task by ID (scoped to authenticated user)
 * @route  GET /api/tasks/:id
 * @access Private
 */
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }

    const task = await Task.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching task'
    });
  }
};

/**
 * @desc   Create a new task for the authenticated user
 * @route  POST /api/tasks
 * @access Private
 */
export const createTask = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Title is required, must be a string, and must be at least 3 characters after trimming'
      });
    }

    const task = await Task.create({
      title: title.trim(),
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating task'
    });
  }
};

/**
 * @desc   Update task (scoped to authenticated user)
 * @route  PATCH /api/tasks/:id
 * @access Private
 */
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }

    const { title, completed } = req.body;

    if (title === undefined && completed === undefined) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (title or completed) must be provided for update'
      });
    }

    const updates = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message: 'Title must be a string with at least 3 characters after trimming'
        });
      }
      updates.title = title.trim();
    }

    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'Completed must be a boolean value (true or false)'
        });
      }
      updates.completed = completed;
    }

    // Strictly forbid updating _id, userId, or createdAt
    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        userId: req.user.id
      },
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating task'
    });
  }
};

/**
 * @desc   Toggle task completion status (scoped to authenticated user)
 * @route  PATCH /api/tasks/:id/complete
 * @access Private
 */
export const toggleComplete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }

    const task = await Task.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task.completed = !task.completed;
    await task.save();

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while toggling task completion'
    });
  }
};

/**
 * @desc   Delete task (scoped to authenticated user)
 * @route  DELETE /api/tasks/:id
 * @access Private
 */
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }

    const task = await Task.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting task'
    });
  }
};
