import prisma from '../config/database.js';

export const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { destinations: true },
      },
    },
  });
};

export const createCategory = async ({ name, description }) => {
  const existing = await prisma.category.findUnique({
    where: { name: name.trim() },
  });

  if (existing) {
    throw new Error('Category already exists.');
  }

  return await prisma.category.create({
    data: {
      name: name.trim(),
      description: description ? description.trim() : null,
    },
  });
};

export const updateCategory = async (id, { name, description }) => {
  return await prisma.category.update({
    where: { id },
    data: {
      name: name?.trim(),
      description: description !== undefined ? description?.trim() : undefined,
    },
  });
};

export const deleteCategory = async (id) => {
  return await prisma.category.delete({
    where: { id },
  });
};
