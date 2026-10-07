import prisma from '../config/database.js';

export const getReviewsForDestination = async (destinationId) => {
  const reviews = await prisma.review.findMany({
    where: { destination_id: destinationId },
    orderBy: { created_at: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profile_image: true,
        },
      },
    },
  });

  const count = reviews.length;
  const averageRating =
    count > 0
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1))
      : 0;

  return {
    reviews,
    averageRating,
    totalReviews: count,
  };
};

export const upsertReview = async (userId, destinationId, { rating, comment }) => {
  // Check if destination exists
  const destination = await prisma.destination.findUnique({
    where: { id: destinationId },
  });

  if (!destination) {
    throw new Error('Destination not found.');
  }

  const review = await prisma.review.upsert({
    where: {
      user_id_destination_id: {
        user_id: userId,
        destination_id: destinationId,
      },
    },
    update: {
      rating: parseInt(rating, 10),
      comment: comment.trim(),
    },
    create: {
      user_id: userId,
      destination_id: destinationId,
      rating: parseInt(rating, 10),
      comment: comment.trim(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profile_image: true,
        },
      },
      destination: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return review;
};

export const updateReview = async (userId, reviewId, { rating, comment }) => {
  const existing = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!existing) {
    throw new Error('Review not found.');
  }

  if (existing.user_id !== userId) {
    throw new Error('You are not authorized to edit this review.');
  }

  return await prisma.review.update({
    where: { id: reviewId },
    data: {
      ...(rating !== undefined && { rating: parseInt(rating, 10) }),
      ...(comment !== undefined && { comment: comment.trim() }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profile_image: true,
        },
      },
    },
  });
};

export const deleteReview = async (userId, reviewId, isAdmin = false) => {
  const existing = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!existing) {
    throw new Error('Review not found.');
  }

  if (!isAdmin && existing.user_id !== userId) {
    throw new Error('You are not authorized to delete this review.');
  }

  return await prisma.review.delete({
    where: { id: reviewId },
  });
};

export const getAllReviewsAdmin = async ({ page = 1, limit = 20, search = '' }) => {
  const pageNumber = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNumber - 1) * pageSize;

  const where = {};
  if (search && search.trim()) {
    const q = search.trim();
    where.OR = [
      { comment: { contains: q, mode: 'insensitive' } },
      { destination: { name: { contains: q, mode: 'insensitive' } } },
      { user: { name: { contains: q, mode: 'insensitive' } } },
      { user: { email: { contains: q, mode: 'insensitive' } } },
    ];
  }

  const [total, reviews] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile_image: true,
          },
        },
        destination: {
          select: {
            id: true,
            name: true,
            province: true,
            image_url: true,
          },
        },
      },
    }),
  ]);

  return {
    reviews,
    pagination: {
      total,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};
