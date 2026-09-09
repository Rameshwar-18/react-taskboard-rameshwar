/**
 * API Service Layer
 * Centralizes all HTTP communication with the Express/MongoDB Atlas backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Reusable HTTP request helper
 *
 * @param {string} endpoint - API path (e.g. '/tasks' or '/auth/login')
 * @param {object} options  - fetch options (method, headers, body, token)
 * @returns {Promise<any>}  - parsed JSON data
 */
async function request(endpoint, { method = 'GET', body, token, headers = {} } = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const requestHeaders = {
    ...headers,
  };

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers: requestHeaders,
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch (netError) {
    console.error(`[API] Network error on ${method} ${url}:`, netError.message);
    throw new Error('Unable to connect to the server. Please check your network connection.');
  }

  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errorMessage =
      data?.message ||
      (response.status === 401
        ? 'Invalid or expired session. Please log in again.'
        : `Request failed with status ${response.status}`);

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;

    // Handle auth expiration across all authenticated requests
    if (response.status === 401 && token) {
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }

    throw error;
  }

  return data;
}

/* ── Authentication API ─────────────────────────────────────────── */

/**
 * Register a new user account
 * @param {object} userData - { name, email, password }
 */
export async function registerUser(userData) {
  return request('/auth/register', {
    method: 'POST',
    body: userData,
  });
}

/**
 * Authenticate user and receive JWT
 * @param {object} credentials - { email, password }
 */
export async function loginUser(credentials) {
  return request('/auth/login', {
    method: 'POST',
    body: credentials,
  });
}

/* ── Task Management API ────────────────────────────────────────── */

/**
 * Fetch all tasks belonging to the authenticated user
 * @param {string} token - JWT Bearer token
 */
export async function getTasks(token) {
  return request('/tasks', {
    method: 'GET',
    token,
  });
}

/**
 * Fetch a single task by ID
 * @param {string} id - Task ObjectId
 * @param {string} token - JWT Bearer token
 */
export async function getTaskById(id, token) {
  return request(`/tasks/${id}`, {
    method: 'GET',
    token,
  });
}

/**
 * Create a new task
 * @param {object} taskData - { title }
 * @param {string} token - JWT Bearer token
 */
export async function createTask(taskData, token) {
  return request('/tasks', {
    method: 'POST',
    body: taskData,
    token,
  });
}

/**
 * Update task title and/or completed status
 * @param {string} id - Task ObjectId
 * @param {object} updates - { title?, completed? }
 * @param {string} token - JWT Bearer token
 */
export async function updateTask(id, updates, token) {
  return request(`/tasks/${id}`, {
    method: 'PATCH',
    body: updates,
    token,
  });
}

/**
 * Toggle task completion status
 * @param {string} id - Task ObjectId
 * @param {string} token - JWT Bearer token
 */
export async function toggleTaskComplete(id, token) {
  return request(`/tasks/${id}/complete`, {
    method: 'PATCH',
    token,
  });
}

/**
 * Delete a task
 * @param {string} id - Task ObjectId
 * @param {string} token - JWT Bearer token
 */
export async function deleteTask(id, token) {
  return request(`/tasks/${id}`, {
    method: 'DELETE',
    token,
  });
}

export default {
  registerUser,
  loginUser,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskComplete,
  deleteTask,
};
