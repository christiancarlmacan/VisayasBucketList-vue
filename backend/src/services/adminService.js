import prisma from '../config/database.js';

export const getAdminDashboardStats = async () => {
  const [
    totalUsers,
    totalDestinations,
    totalReviews,
    totalBucketLists,
    totalFavorites,
    recentUsers,
    recentReviews,
    recentDestinations,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.destination.count(),
    prisma.review.count(),
    prisma.bucketList.count(),
    prisma.favorite.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
    }),
    prisma.review.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        user: { select: { id: true, name: true } },
        destination: { select: { id: true, name: true } },
      },
    }),
    prisma.destination.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        category: { select: { name: true } },
      },
    }),
  ]);

  return {
    counts: {
      users: totalUsers,
      destinations: totalDestinations,
      reviews: totalReviews,
      bucketLists: totalBucketLists,
      favorites: totalFavorites,
    },
    recentUsers,
    recentReviews,
    recentDestinations,
  };
};
