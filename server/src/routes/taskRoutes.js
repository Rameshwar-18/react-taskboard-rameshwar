import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleComplete,
  deleteTask
} from '../controllers/taskController.js';

const router = express.Router();

// Apply authMiddleware to all task routes
router.use(authMiddleware);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTaskById)
  .patch(updateTask)
  .delete(deleteTask);

router.patch('/:id/complete', toggleComplete);

export default router;
