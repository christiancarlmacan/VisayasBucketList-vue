import prisma from '../config/database.js';

export const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profile_image: true,
      created_at: true,
      _count: {
        select: {
          bucket_lists: true,
          favorites: true,
          reviews: true,
          achievements: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found.');
  }

  const visitedCount = await prisma.bucketList.count({
    where: { user_id: userId, status: 'VISITED' },
  });

  return {
    ...user,
    stats: {
      totalBucketList: user._count.bucket_lists,
      visitedCount,
      wantToVisitCount: user._count.bucket_lists - visitedCount,
      favoritesCount: user._count.favorites,
      reviewsCount: user._count.reviews,
      achievementsCount: user._count.achievements,
    },
  };
};

export const updateUserProfile = async (userId, { name, profile_image }) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name && { name: name.trim() }),
      ...(profile_image !== undefined && { profile_image: profile_image ? profile_image.trim() : null }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profile_image: true,
      created_at: true,
    },
  });
};

export const getAllUsersAdmin = async ({ page = 1, limit = 20, search = '' }) => {
  const pageNumber = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNumber - 1) * pageSize;

  const where = {};
  if (search && search.trim()) {
    const q = search.trim();
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
    ];
  }

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile_image: true,
        created_at: true,
        _count: {
          select: {
            bucket_lists: true,
            favorites: true,
            reviews: true,
          },
        },
      },
    }),
  ]);

  return {
    users,
    pagination: {
      total,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

export const updateUserRoleAdmin = async (userId, newRole) => {
  if (!['USER', 'ADMIN'].includes(newRole)) {
    throw new Error('Invalid role specified.');
  }

  return await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

export const deleteUserAdmin = async (targetUserId, currentAdminId) => {
  if (targetUserId === currentAdminId) {
    throw new Error('You cannot delete your own admin account.');
  }

  return await prisma.user.delete({
    where: { id: targetUserId },
  });
};
