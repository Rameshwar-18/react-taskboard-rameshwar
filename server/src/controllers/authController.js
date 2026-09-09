import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const SALT_ROUNDS = 10;

/**
 * @desc   Register a new user
 * @route  POST /api/auth/register
 * @access Public
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation: name
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Name is required and must be a valid string'
      });
    }

    // Validation: email
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Email is required and must be a valid string'
      });
    }

    // Validation: password
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password is required and must be at least 6 characters long'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user document
    const user = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during user registration'
    });
  }
};

/**
 * @desc   Authenticate user & obtain JWT token
 * @route  POST /api/auth/login
 * @access Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Verify JWT configuration
    if (!process.env.JWT_SECRET) {
      console.error('FATAL: JWT_SECRET environment variable is not defined.');
      return res.status(500).json({
        success: false,
        message: 'Authentication configuration error'
      });
    }

    // Find user by normalized email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};
