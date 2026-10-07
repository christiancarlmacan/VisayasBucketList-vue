export const validateReviewInput = ({ rating, comment }) => {
  if (rating === undefined || rating === null) {
    return 'Rating is required.';
  }

  const numericRating = Number(rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return 'Rating must be an integer between 1 and 5.';
  }

  if (!comment || typeof comment !== 'string' || comment.trim().length < 3) {
    return 'Comment is required and must be at least 3 characters long.';
  }

  if (comment.trim().length > 1000) {
    return 'Comment cannot exceed 1000 characters.';
  }

  return null;
};
