import { sendError } from '../utils/helpers.js';

export const errorHandler = (err, req, res, next) => {
  console.error('🔥 Server Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return sendError(res, message, statusCode);
};
