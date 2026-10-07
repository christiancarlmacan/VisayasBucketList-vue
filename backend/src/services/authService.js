import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'visayas_bucketlist_super_secret_jwt_key_2026';
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: '7d' }
  );
};

export const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new Error('An account with this email already exists.');
  }

  const saltRounds = 10;
  const password_hash = await bcrypt.hash(password, saltRounds);

  const newUser = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      password_hash,
      role: 'USER',
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

  const token = generateToken(newUser);

  return { user: newUser, token };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new Error('Invalid email or password credentials.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password credentials.');
  }

  const userProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    profile_image: user.profile_image,
    created_at: user.created_at,
  };

  const token = generateToken(user);

  return { user: userProfile, token };
};

export const getCurrentUserProfile = async (userId) => {
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
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found.');
  }

  return user;
};
