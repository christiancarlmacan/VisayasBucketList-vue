/**
 * Standard API response helper for success payloads
 */
export const sendSuccess = (res, data = {}, message = 'Operation successful', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

/**
 * Standard API response helper for error payloads
 */
export const sendError = (res, error = 'An error occurred', statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error,
  });
};

/**
 * Generate URL-friendly slug from string
 */
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
};
