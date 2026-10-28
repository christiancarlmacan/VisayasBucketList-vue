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

export const googleAuthUser = async ({ email, name, profile_image }) => {
  const normalizedEmail = email.toLowerCase().trim();

  let user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    const randomPass = `google_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const password_hash = await bcrypt.hash(randomPass, 10);

    user = await prisma.user.create({
      data: {
        name: (name || normalizedEmail.split('@')[0]).trim(),
        email: normalizedEmail,
        password_hash,
        profile_image: profile_image || null,
        role: 'USER',
      },
    });
  } else if (profile_image && !user.profile_image) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { profile_image },
    });
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

export const createPasswordResetToken = async ({ email }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new Error('No account found with that email address.');
  }

  const secret = process.env.JWT_SECRET || 'visayas_bucketlist_super_secret_jwt_key_2026';
  const resetToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      purpose: 'PASSWORD_RESET',
    },
    secret,
    { expiresIn: '15m' }
  );

  return {
    email: user.email,
    name: user.name,
    resetToken,
  };
};

export const resetUserPassword = async ({ email, resetToken, newPassword, viaGoogle }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new Error('No account found with that email address.');
  }

  if (!viaGoogle) {
    if (!resetToken) {
      throw new Error('Invalid or missing password reset token.');
    }
    const secret = process.env.JWT_SECRET || 'visayas_bucketlist_super_secret_jwt_key_2026';
    try {
      const decoded = jwt.verify(resetToken, secret);
      if (decoded.email !== normalizedEmail || decoded.purpose !== 'PASSWORD_RESET') {
        throw new Error('Invalid password reset token.');
      }
    } catch {
      throw new Error('Password reset session expired or invalid. Please request a new one.');
    }
  }

  const password_hash = await bcrypt.hash(newPassword, 10);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { password_hash },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profile_image: true,
      created_at: true,
    },
  });

  const token = generateToken(updatedUser);
  return { user: updatedUser, token };
};
