import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import Task from '../src/models/Task.js';

let server;
const PORT = 5055;
const BASE_URL = `http://localhost:${PORT}/api`;

async function request(endpoint, { method = 'GET', body, headers = {}, token } = {}) {
  const reqHeaders = { ...headers };
  if (body !== undefined) {
    reqHeaders['Content-Type'] = 'application/json';
  }
  if (token) {
    reqHeaders['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: reqHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const ct = res.headers.get('content-type');
  if (ct && ct.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  return { status: res.status, headers: res.headers, data };
}

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTests() {
  console.log('Connecting to MongoDB Atlas...');
  await connectDB();
  console.log('MongoDB Atlas Connected successfully.');

  server = http.createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`QA Test Server listening on port ${PORT}\n`);

  const uniqueSuffix = Date.now().toString().slice(-6);
  const userAData = {
    name: 'QA User A',
    email: `qa_user_a_${uniqueSuffix}@example.com`,
    password: 'password123',
  };
  const userBData = {
    name: 'QA User B',
    email: `qa_user_b_${uniqueSuffix}@example.com`,
    password: 'password456',
  };

  let tokenA = null;
  let userAId = null;
  let tokenB = null;
  let userBId = null;
  let taskAId = null;
  let taskBId = null;

  try {
    // 1. Health Check
    console.log('=== TEST SUITE 1: Server Health ===');
    const health = await request('/health');
    assert(health.status === 200, 'GET /api/health returns 200');
    assert(health.data.success === true, 'GET /api/health success is true');
    assert(health.data.message === 'API is running', 'GET /api/health message is correct');

    // 2. CORS Verification
    console.log('\n=== TEST SUITE 2: CORS Configuration ===');
    const corsDev = await fetch(`${BASE_URL}/health`, {
      headers: { Origin: 'http://localhost:5173' },
    });
    assert(
      corsDev.headers.get('access-control-allow-origin') === 'http://localhost:5173',
      'CORS allows http://localhost:5173'
    );

    const corsProd = await fetch(`${BASE_URL}/health`, {
      headers: { Origin: 'https://react-taskboard-rameshwar.vercel.app' },
    });
    assert(
      corsProd.headers.get('access-control-allow-origin') === 'https://react-taskboard-rameshwar.vercel.app',
      'CORS allows https://react-taskboard-rameshwar.vercel.app'
    );

    // 3. User Registration
    console.log('\n=== TEST SUITE 3: User Registration ===');
    // Short password
    const regShortPass = await request('/auth/register', {
      method: 'POST',
      body: { name: 'Short', email: 'short@test.com', password: '123' },
    });
    assert(regShortPass.status === 400, 'Registration rejects password < 6 chars (400)');

    // Missing name
    const regNoName = await request('/auth/register', {
      method: 'POST',
      body: { name: '', email: 'noname@test.com', password: 'password123' },
    });
    assert(regNoName.status === 400, 'Registration rejects missing name (400)');

    // Valid registration: User A
    const regA = await request('/auth/register', {
      method: 'POST',
      body: userAData,
    });
    assert(regA.status === 201, 'User A registration returns 201');
    assert(regA.data.success === true, 'User A registration success is true');
    assert(regA.data.data.user.email === userAData.email, 'User A email returned correctly');
    userAId = regA.data.data.user.id;

    // Duplicate registration: User A again
    const regDup = await request('/auth/register', {
      method: 'POST',
      body: userAData,
    });
    assert(regDup.status === 409, 'Duplicate registration returns 409 Conflict');

    // 4. User Login
    console.log('\n=== TEST SUITE 4: User Authentication & JWT ===');
    // Invalid password
    const loginWrongPass = await request('/auth/login', {
      method: 'POST',
      body: { email: userAData.email, password: 'wrongpassword' },
    });
    assert(loginWrongPass.status === 401, 'Login with wrong password returns 401');

    // Non-existent user
    const loginNonExistent = await request('/auth/login', {
      method: 'POST',
      body: { email: 'nobody_here_9999@test.com', password: 'password123' },
    });
    assert(loginNonExistent.status === 401, 'Login with non-existent email returns 401');

    // Successful login: User A
    const loginA = await request('/auth/login', {
      method: 'POST',
      body: { email: userAData.email, password: userAData.password },
    });
    assert(loginA.status === 200, 'Login with correct credentials returns 200');
    assert(Boolean(loginA.data.data.token), 'Login returns a valid JWT token');
    assert(loginA.data.data.user.id === userAId, 'Login returns correct user ID');
    tokenA = loginA.data.data.token;

    // 5. Auth Middleware & Token Protection
    console.log('\n=== TEST SUITE 5: Authentication Protection & 401 Handling ===');
    // Missing token
    const noToken = await request('/tasks');
    assert(noToken.status === 401, 'GET /api/tasks without token returns 401');

    // Invalid token
    const invalidToken = await request('/tasks', { token: 'invalid.bearer.token.123' });
    assert(invalidToken.status === 401, 'GET /api/tasks with malformed token returns 401');

    // 6. Task CRUD: User A
    console.log('\n=== TEST SUITE 6: Task CRUD Operations (User A) ===');
    // Initially get tasks
    const initialTasksA = await request('/tasks', { token: tokenA });
    assert(initialTasksA.status === 200, 'GET /api/tasks returns 200');
    assert(Array.isArray(initialTasksA.data.data), 'GET /api/tasks data is an array');

    // Create invalid task (empty title)
    const emptyTask = await request('/tasks', {
      method: 'POST',
      body: { title: '  ' },
      token: tokenA,
    });
    assert(emptyTask.status === 400, 'POST /api/tasks rejects empty title (400)');

    // Create invalid task (< 3 chars)
    const shortTask = await request('/tasks', {
      method: 'POST',
      body: { title: 'ab' },
      token: tokenA,
    });
    assert(shortTask.status === 400, 'POST /api/tasks rejects title < 3 chars (400)');

    // Create valid task: Task A
    const createdTaskA = await request('/tasks', {
      method: 'POST',
      body: { title: `Task A Title ${uniqueSuffix}` },
      token: tokenA,
    });
    assert(createdTaskA.status === 201, 'POST /api/tasks returns 201');
    assert(createdTaskA.data.data.title === `Task A Title ${uniqueSuffix}`, 'Task A title is correct');
    assert(createdTaskA.data.data.completed === false, 'Task A starts uncompleted');
    assert(createdTaskA.data.data.userId === userAId, 'Task A userId matches User A');
    taskAId = createdTaskA.data.data._id;

    // Get Task A by ID
    const getTaskA = await request(`/tasks/${taskAId}`, { token: tokenA });
    assert(getTaskA.status === 200, 'GET /api/tasks/:id returns 200 for owner');
    assert(getTaskA.data.data.title === `Task A Title ${uniqueSuffix}`, 'GET /api/tasks/:id returns correct task');

    // Update Task A title
    const updatedTaskA = await request(`/tasks/${taskAId}`, {
      method: 'PATCH',
      body: { title: `Task A Updated ${uniqueSuffix}` },
      token: tokenA,
    });
    assert(updatedTaskA.status === 200, 'PATCH /api/tasks/:id returns 200');
    assert(updatedTaskA.data.data.title === `Task A Updated ${uniqueSuffix}`, 'Task A title updated in MongoDB');

    // Toggle complete Task A
    const toggledA1 = await request(`/tasks/${taskAId}/complete`, {
      method: 'PATCH',
      token: tokenA,
    });
    assert(toggledA1.status === 200, 'PATCH /api/tasks/:id/complete returns 200');
    assert(toggledA1.data.data.completed === true, 'Task A toggled to completed (true)');

    // Toggle complete Task A again
    const toggledA2 = await request(`/tasks/${taskAId}/complete`, {
      method: 'PATCH',
      token: tokenA,
    });
    assert(toggledA2.status === 200, 'PATCH /api/tasks/:id/complete again returns 200');
    assert(toggledA2.data.data.completed === false, 'Task A toggled back to incomplete (false)');

    // 7. Multi-User Isolation & Ownership Protection
    console.log('\n=== TEST SUITE 7: Two-User Ownership & Isolation ===');
    // Register User B
    const regB = await request('/auth/register', {
      method: 'POST',
      body: userBData,
    });
    assert(regB.status === 201, 'User B registration returns 201');
    userBId = regB.data.data.user.id;

    // Login User B
    const loginB = await request('/auth/login', {
      method: 'POST',
      body: { email: userBData.email, password: userBData.password },
    });
    assert(loginB.status === 200, 'User B login returns 200');
    tokenB = loginB.data.data.token;

    // User B lists tasks: Task A must NOT be visible
    const tasksB = await request('/tasks', { token: tokenB });
    assert(tasksB.status === 200, 'User B lists tasks (200)');
    const foundTaskAInB = tasksB.data.data.some((t) => t._id === taskAId);
    assert(!foundTaskAInB, 'Task A is NOT visible in User B task list');

    // User B attempts to access Task A directly by ID
    const userBAccessA = await request(`/tasks/${taskAId}`, { token: tokenB });
    assert(userBAccessA.status === 404, 'User B accessing Task A directly returns 404 Not Found');

    // User B attempts to update Task A
    const userBUpdateA = await request(`/tasks/${taskAId}`, {
      method: 'PATCH',
      body: { title: 'Hacked by User B' },
      token: tokenB,
    });
    assert(userBUpdateA.status === 404, 'User B updating Task A returns 404 Not Found');

    // User B attempts to toggle completion on Task A
    const userBToggleA = await request(`/tasks/${taskAId}/complete`, {
      method: 'PATCH',
      token: tokenB,
    });
    assert(userBToggleA.status === 404, 'User B toggling Task A completion returns 404 Not Found');

    // User B attempts to delete Task A
    const userBDeleteA = await request(`/tasks/${taskAId}`, {
      method: 'DELETE',
      token: tokenB,
    });
    assert(userBDeleteA.status === 404, 'User B deleting Task A returns 404 Not Found');

    // User B creates Task B
    const createdTaskB = await request('/tasks', {
      method: 'POST',
      body: { title: `Task B Title ${uniqueSuffix}` },
      token: tokenB,
    });
    assert(createdTaskB.status === 201, 'User B creates Task B (201)');
    taskBId = createdTaskB.data.data._id;

    // User A logs in again / lists tasks: Task A exists, Task B NOT visible
    const tasksAAfter = await request('/tasks', { token: tokenA });
    assert(tasksAAfter.status === 200, 'User A lists tasks again (200)');
    const foundTaskAInA = tasksAAfter.data.data.some((t) => t._id === taskAId);
    const foundTaskBInA = tasksAAfter.data.data.some((t) => t._id === taskBId);
    assert(foundTaskAInA, 'User A sees Task A');
    assert(!foundTaskBInA, 'User A does NOT see Task B');

    // 8. Delete Tasks
    console.log('\n=== TEST SUITE 8: Task Deletion ===');
    const deleteA = await request(`/tasks/${taskAId}`, {
      method: 'DELETE',
      token: tokenA,
    });
    assert(deleteA.status === 200, 'User A successfully deletes Task A (200)');

    const getADeleted = await request(`/tasks/${taskAId}`, { token: tokenA });
    assert(getADeleted.status === 404, 'Task A is no longer accessible after deletion (404)');

    const deleteB = await request(`/tasks/${taskBId}`, {
      method: 'DELETE',
      token: tokenB,
    });
    assert(deleteB.status === 200, 'User B successfully deletes Task B (200)');

    // Cleanup QA test users
    console.log('\nCleaning up QA test accounts from MongoDB Atlas...');
    await User.deleteMany({ _id: { $in: [userAId, userBId] } });
    await Task.deleteMany({ _id: { $in: [taskAId, taskBId] } });
    console.log('Cleanup complete.');

    console.log(`\n========================================`);
    console.log(`ALL BACKEND TESTS PASSED: ${passedTests} / ${totalTests}`);
    console.log(`========================================\n`);
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  }
}

runTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Test Suite Failed:', err);
    process.exit(1);
  });
