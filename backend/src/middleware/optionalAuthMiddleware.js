import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';

export const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'visayas_bucketlist_super_secret_jwt_key_2026';
      const decoded = jwt.verify(token, secret);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, role: true },
      });
      if (user) {
        req.user = user;
      }
    }
  } catch (err) {
    // Silently continue without user context
  }
  next();
};
