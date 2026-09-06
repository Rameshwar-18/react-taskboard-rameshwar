import mongoose from 'mongoose';
import Task from '../models/Task.js';
import User from '../models/User.js';

/**
 * Temporary development helper to ensure a valid User document exists for tasks.
 * Preserves the required Task.userId reference to User without accepting untrusted client input.
 * TODO: Replace with req.user.id once JWT authentication is implemented in Phase 4.
 */
const getDevUserId = async () => {
  let devUser = await User.findOne({ email: 'dev@taskboard.local' });
  if (!devUser) {
    devUser = await User.create({
      name: 'Development User',
      email: 'dev@taskboard.local',
      password: 'devpassword123'
    });
  }
  return devUser._id;
};

/**
 * @desc   Get all tasks
 * @route  GET /api/tasks
 * @access Public (Temporary in Phase 3 - will be user-scoped in Phase 4)
 */
export const getTasks = async (req, res) => {
  try {
    // TODO: In Phase 4/Auth phase, scope to authenticated user: { userId: req.user.id }
    const tasks = await Task.find().sort({ createdAt: -1 });

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
 * @desc   Get single task by ID
 * @route  GET /api/tasks/:id
 * @access Public
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

    const task = await Task.findById(id);

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
 * @desc   Create a new task
 * @route  POST /api/tasks
 * @access Public (Temporary development ownership strategy)
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

    // Assign development user ID to satisfy Task.userId schema requirement
    // TODO: Replace with req.user.id in authentication phase
    const userId = await getDevUserId();

    const task = await Task.create({
      title: title.trim(),
      userId
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
 * @desc   Update task (title and/or completed)
 * @route  PATCH /api/tasks/:id
 * @access Public
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

    const task = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
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
      message: 'Server error while updating task'
    });
  }
};

/**
 * @desc   Toggle task completion status
 * @route  PATCH /api/tasks/:id/complete
 * @access Public
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

    const task = await Task.findById(id);

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
 * @desc   Delete task
 * @route  DELETE /api/tasks/:id
 * @access Public
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

    const task = await Task.findByIdAndDelete(id);

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
