import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized - missing token' });
    }
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({ success: false, error: 'Unauthorized - user not found' });
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, error: 'Unauthorized - invalid token' });
  }
};

const permit = (...allowedRoles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });

  // Normalize roles to a common case to avoid mismatch like 'admin' vs 'ADMIN'
  const userRole = (req.user.role || '').toUpperCase();
  const normalizedAllowed = allowedRoles.map((r) => (r || '').toUpperCase());

  if (!normalizedAllowed.includes(userRole)) {
    return res.status(403).json({ success: false, error: 'Forbidden - insufficient permissions' });
  }
  next();
};

export { authMiddleware, permit };
