import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleComplete,
  deleteTask
} from '../controllers/taskController.js';

const router = express.Router();

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTaskById)
  .patch(updateTask)
  .delete(deleteTask);

router.patch('/:id/complete', toggleComplete);

export default router;
