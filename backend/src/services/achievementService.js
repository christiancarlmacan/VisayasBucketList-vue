import prisma from '../config/database.js';

export const getAllAchievements = async () => {
  return await prisma.achievement.findMany({
    orderBy: { requirement: 'asc' },
  });
};

export const getUserAchievements = async (userId) => {
  const [allAchievements, userAchievements, totalVisited, beachCount, mountainCount, totalBucketList] =
    await Promise.all([
      prisma.achievement.findMany({ orderBy: { requirement: 'asc' } }),
      prisma.userAchievement.findMany({
        where: { user_id: userId },
        include: { achievement: true },
      }),
      prisma.bucketList.count({
        where: { user_id: userId, status: 'VISITED' },
      }),
      prisma.bucketList.count({
        where: {
          user_id: userId,
          status: 'VISITED',
          destination: { category: { name: { equals: 'Beach', mode: 'insensitive' } } },
        },
      }),
      prisma.bucketList.count({
        where: {
          user_id: userId,
          status: 'VISITED',
          destination: { category: { name: { equals: 'Mountain', mode: 'insensitive' } } },
        },
      }),
      prisma.bucketList.count({
        where: { user_id: userId },
      }),
    ]);

  const earnedMap = new Map(userAchievements.map((ua) => [ua.achievement_id, ua.earned_at]));

  const achievementsWithProgress = allAchievements.map((ach) => {
    let current = 0;
    if (ach.name === 'Island Explorer') current = totalVisited;
    else if (ach.name === 'Beach Hopper') current = beachCount;
    else if (ach.name === 'Peak Seeker') current = mountainCount;
    else if (ach.name === 'Visayas Master') current = totalBucketList;
    else current = totalVisited;

    const isUnlocked = earnedMap.has(ach.id) || current >= ach.requirement;
    const progressPercent = Math.min(100, Math.round((current / ach.requirement) * 100));

    return {
      id: ach.id,
      name: ach.name,
      description: ach.description,
      icon: ach.icon || 'award',
      requirement: ach.requirement,
      current,
      progressPercent,
      isUnlocked,
      earned_at: earnedMap.get(ach.id) || null,
    };
  });

  const totalEarned = achievementsWithProgress.filter((a) => a.isUnlocked).length;

  return {
    achievements: achievementsWithProgress,
    stats: {
      totalAchievements: allAchievements.length,
      earnedCount: totalEarned,
      completionRate:
        allAchievements.length > 0
          ? Math.round((totalEarned / allAchievements.length) * 100)
          : 0,
      totalVisited,
      beachCount,
      mountainCount,
      totalBucketList,
    },
  };
};

export const checkAndAwardAchievements = async (userId) => {
  const [allAchievements, userAchievements, totalVisited, beachCount, mountainCount, totalBucketList] =
    await Promise.all([
      prisma.achievement.findMany(),
      prisma.userAchievement.findMany({ where: { user_id: userId } }),
      prisma.bucketList.count({ where: { user_id: userId, status: 'VISITED' } }),
      prisma.bucketList.count({
        where: {
          user_id: userId,
          status: 'VISITED',
          destination: { category: { name: { equals: 'Beach', mode: 'insensitive' } } },
        },
      }),
      prisma.bucketList.count({
        where: {
          user_id: userId,
          status: 'VISITED',
          destination: { category: { name: { equals: 'Mountain', mode: 'insensitive' } } },
        },
      }),
      prisma.bucketList.count({ where: { user_id: userId } }),
    ]);

  const earnedSet = new Set(userAchievements.map((ua) => ua.achievement_id));
  const newlyAwarded = [];

  for (const ach of allAchievements) {
    if (earnedSet.has(ach.id)) continue;

    let qualifies = false;
    if (ach.name === 'Island Explorer' && totalVisited >= ach.requirement) qualifies = true;
    if (ach.name === 'Beach Hopper' && beachCount >= ach.requirement) qualifies = true;
    if (ach.name === 'Peak Seeker' && mountainCount >= ach.requirement) qualifies = true;
    if (ach.name === 'Visayas Master' && totalBucketList >= ach.requirement) qualifies = true;

    if (qualifies) {
      const awarded = await prisma.userAchievement.create({
        data: {
          user_id: userId,
          achievement_id: ach.id,
        },
        include: { achievement: true },
      });
      newlyAwarded.push(awarded);
    }
  }

  return newlyAwarded;
};
