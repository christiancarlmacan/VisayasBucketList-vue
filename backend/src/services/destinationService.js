import prisma from '../config/database.js';
import { slugify } from '../utils/helpers.js';

export const getDestinations = async ({
  search,
  region,
  province,
  category,
  page = 1,
  limit = 12,
  userId = null,
}) => {
  const pageNumber = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
  const skip = (pageNumber - 1) * pageSize;

  const where = {};

  if (search && search.trim()) {
    const q = search.trim();
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { province: { contains: q, mode: 'insensitive' } },
      { location: { contains: q, mode: 'insensitive' } },
    ];
  }

  if (region && region.trim()) {
    where.region = { equals: region.trim(), mode: 'insensitive' };
  }

  if (province && province.trim()) {
    where.province = { equals: province.trim(), mode: 'insensitive' };
  }

  if (category && category.trim()) {
    // Can filter by category ID or category name
    where.OR = [
      ...(where.OR || []),
      { category_id: category.trim() },
      { category: { name: { equals: category.trim(), mode: 'insensitive' } } },
    ];
  }

  const [total, rawDestinations] = await Promise.all([
    prisma.destination.count({ where }),
    prisma.destination.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { created_at: 'desc' },
      include: {
        category: {
          select: { id: true, name: true },
        },
        reviews: {
          select: { rating: true },
        },
        _count: {
          select: {
            bucket_lists: true,
            favorites: true,
            reviews: true,
          },
        },
        ...(userId
          ? {
              bucket_lists: {
                where: { user_id: userId },
                select: { id: true, status: true },
              },
              favorites: {
                where: { user_id: userId },
                select: { id: true },
              },
            }
          : {}),
      },
    }),
  ]);

  const destinations = rawDestinations.map((d) => {
    const reviewCount = d.reviews.length;
    const avgRating =
      reviewCount > 0
        ? Number((d.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
        : 0;

    const { reviews, bucket_lists, favorites, _count, ...rest } = d;

    return {
      ...rest,
      average_rating: avgRating,
      reviews_count: _count.reviews,
      saves_count: _count.bucket_lists,
      favorites_count: _count.favorites,
      is_in_bucketlist: userId && bucket_lists && bucket_lists.length > 0,
      bucketlist_status: userId && bucket_lists && bucket_lists.length > 0 ? bucket_lists[0].status : null,
      is_favorite: userId && favorites && favorites.length > 0,
    };
  });

  return {
    destinations,
    pagination: {
      total,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

export const getDestinationByIdOrSlug = async (idOrSlug, userId = null) => {
  const destination = await prisma.destination.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      category: {
        select: { id: true, name: true },
      },
      reviews: {
        include: {
          user: {
            select: { id: true, name: true, profile_image: true },
          },
        },
        orderBy: { created_at: 'desc' },
      },
      _count: {
        select: {
          bucket_lists: true,
          favorites: true,
          reviews: true,
        },
      },
      ...(userId
        ? {
            bucket_lists: {
              where: { user_id: userId },
              select: { id: true, status: true },
            },
            favorites: {
              where: { user_id: userId },
              select: { id: true },
            },
          }
        : {}),
    },
  });

  if (!destination) {
    throw new Error('Destination not found.');
  }

  const reviewCount = destination.reviews.length;
  const avgRating =
    reviewCount > 0
      ? Number((destination.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
      : 0;

  const is_in_bucketlist = userId && destination.bucket_lists && destination.bucket_lists.length > 0;
  const bucketlist_status = is_in_bucketlist ? destination.bucket_lists[0].status : null;
  const is_favorite = userId && destination.favorites && destination.favorites.length > 0;

  return {
    ...destination,
    average_rating: avgRating,
    reviews_count: destination._count.reviews,
    saves_count: destination._count.bucket_lists,
    favorites_count: destination._count.favorites,
    is_in_bucketlist,
    bucketlist_status,
    is_favorite,
  };
};

export const createDestination = async (data) => {
  const baseSlug = slugify(data.name);
  let uniqueSlug = baseSlug;
  let counter = 1;

  while (await prisma.destination.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return await prisma.destination.create({
    data: {
      name: data.name.trim(),
      slug: uniqueSlug,
      description: data.description.trim(),
      province: data.province.trim(),
      region: data.region.trim(),
      location: data.location.trim(),
      latitude: data.latitude ? parseFloat(data.latitude) : null,
      longitude: data.longitude ? parseFloat(data.longitude) : null,
      estimated_budget: data.estimated_budget ? parseFloat(data.estimated_budget) : null,
      recommended_days: data.recommended_days ? parseInt(data.recommended_days, 10) : null,
      image_url: data.image_url ? data.image_url.trim() : null,
      category_id: data.category_id,
    },
    include: {
      category: true,
    },
  });
};

export const updateDestination = async (id, data) => {
  const existing = await prisma.destination.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Destination not found.');
  }

  let slug = existing.slug;
  if (data.name && data.name.trim() !== existing.name) {
    const baseSlug = slugify(data.name);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (
      await prisma.destination.findFirst({
        where: { slug: uniqueSlug, NOT: { id } },
      })
    ) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    slug = uniqueSlug;
  }

  return await prisma.destination.update({
    where: { id },
    data: {
      name: data.name ? data.name.trim() : undefined,
      slug,
      description: data.description ? data.description.trim() : undefined,
      province: data.province ? data.province.trim() : undefined,
      region: data.region ? data.region.trim() : undefined,
      location: data.location ? data.location.trim() : undefined,
      latitude: data.latitude !== undefined ? (data.latitude ? parseFloat(data.latitude) : null) : undefined,
      longitude: data.longitude !== undefined ? (data.longitude ? parseFloat(data.longitude) : null) : undefined,
      estimated_budget: data.estimated_budget !== undefined ? (data.estimated_budget ? parseFloat(data.estimated_budget) : null) : undefined,
      recommended_days: data.recommended_days !== undefined ? (data.recommended_days ? parseInt(data.recommended_days, 10) : null) : undefined,
      image_url: data.image_url !== undefined ? (data.image_url ? data.image_url.trim() : null) : undefined,
      category_id: data.category_id || undefined,
    },
    include: {
      category: true,
    },
  });
};

export const deleteDestination = async (id) => {
  return await prisma.destination.delete({
    where: { id },
  });
};
