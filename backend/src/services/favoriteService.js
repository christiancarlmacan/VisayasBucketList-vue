import prisma from '../config/database.js';

export const getUserFavorites = async (userId) => {
  return await prisma.favorite.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    include: {
      destination: {
        include: {
          category: {
            select: { id: true, name: true },
          },
          _count: {
            select: { reviews: true, bucket_lists: true },
          },
        },
      },
    },
  });
};

export const addFavorite = async (userId, destinationId) => {
  const destination = await prisma.destination.findUnique({
    where: { id: destinationId },
  });

  if (!destination) {
    throw new Error('Destination does not exist.');
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      user_id_destination_id: {
        user_id: userId,
        destination_id: destinationId,
      },
    },
  });

  if (existing) {
    return existing; // Already favorited
  }

  return await prisma.favorite.create({
    data: {
      user_id: userId,
      destination_id: destinationId,
    },
    include: {
      destination: true,
    },
  });
};

export const removeFavorite = async (userId, destinationId) => {
  const existing = await prisma.favorite.findFirst({
    where: {
      user_id: userId,
      destination_id: destinationId,
    },
  });

  if (!existing) {
    throw new Error('Destination is not in your favorites.');
  }

  return await prisma.favorite.delete({
    where: { id: existing.id },
  });
};
