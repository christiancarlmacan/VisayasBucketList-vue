import prisma from '../config/database.js';
import { checkAndAwardAchievements } from './achievementService.js';

export const getUserBucketList = async (userId, filterStatus = null) => {
  const where = { user_id: userId };
  if (filterStatus && ['WANT_TO_VISIT', 'VISITED'].includes(filterStatus.toUpperCase())) {
    where.status = filterStatus.toUpperCase();
  }

  const items = await prisma.bucketList.findMany({
    where,
    orderBy: { created_at: 'desc' },
    include: {
      destination: {
        include: {
          category: {
            select: { id: true, name: true },
          },
          _count: {
            select: { reviews: true, favorites: true },
          },
        },
      },
    },
  });

  // Calculate statistics for the user
  const total = await prisma.bucketList.count({ where: { user_id: userId } });
  const visitedCount = await prisma.bucketList.count({
    where: { user_id: userId, status: 'VISITED' },
  });
  const wantToVisitCount = total - visitedCount;
  const completionPercentage = total > 0 ? Math.round((visitedCount / total) * 100) : 0;

  return {
    items,
    stats: {
      total,
      visitedCount,
      wantToVisitCount,
      completionPercentage,
    },
  };
};

export const addToBucketList = async (userId, destinationId, status = 'WANT_TO_VISIT') => {
  // Validate destination exists
  const destination = await prisma.destination.findUnique({
    where: { id: destinationId },
  });

  if (!destination) {
    throw new Error('Destination does not exist.');
  }

  const existing = await prisma.bucketList.findUnique({
    where: {
      user_id_destination_id: {
        user_id: userId,
        destination_id: destinationId,
      },
    },
  });

  if (existing) {
    throw new Error('This destination is already in your bucket list.');
  }

  const validStatus = status === 'VISITED' ? 'VISITED' : 'WANT_TO_VISIT';

  const createdItem = await prisma.bucketList.create({
    data: {
      user_id: userId,
      destination_id: destinationId,
      status: validStatus,
    },
    include: {
      destination: {
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });

  // Evaluate achievements in background / non-blocking
  checkAndAwardAchievements(userId).catch((err) =>
    console.error('Error awarding achievements on add:', err)
  );

  return createdItem;
};

export const updateBucketListItemStatus = async (userId, idOrDestinationId, status) => {
  const validStatus = status === 'VISITED' ? 'VISITED' : 'WANT_TO_VISIT';

  // Support finding by bucket_list id OR destination_id
  const item = await prisma.bucketList.findFirst({
    where: {
      user_id: userId,
      OR: [{ id: idOrDestinationId }, { destination_id: idOrDestinationId }],
    },
  });

  if (!item) {
    throw new Error('Bucket list entry not found.');
  }

  const updatedItem = await prisma.bucketList.update({
    where: { id: item.id },
    data: { status: validStatus },
    include: {
      destination: {
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });

  // Evaluate achievements if marked as visited
  if (validStatus === 'VISITED') {
    checkAndAwardAchievements(userId).catch((err) =>
      console.error('Error awarding achievements on update:', err)
    );
  }

  return updatedItem;
};

export const removeFromBucketList = async (userId, idOrDestinationId) => {
  const item = await prisma.bucketList.findFirst({
    where: {
      user_id: userId,
      OR: [{ id: idOrDestinationId }, { destination_id: idOrDestinationId }],
    },
  });

  if (!item) {
    throw new Error('Bucket list entry not found.');
  }

  return await prisma.bucketList.delete({
    where: { id: item.id },
  });
};
