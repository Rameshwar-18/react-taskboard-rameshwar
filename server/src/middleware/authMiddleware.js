import jwt from 'jsonwebtoken';

/**
 * Authentication middleware to verify incoming JSON Web Tokens (JWT).
 * Expects the 'Authorization: Bearer <token>' header.
 * Attaches authenticated user payload { id: decoded.userId } to req.user.
 */
const authMiddleware = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET environment variable is not defined.');
    return res.status(500).json({
      success: false,
      message: 'Authentication configuration error'
    });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    req.user = {
      id: decoded.userId
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

export default authMiddleware;
