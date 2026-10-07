export const validateRegisterInput = ({ name, email, password }) => {
  if (!name || name.trim().length < 2) {
    return 'Name is required and must be at least 2 characters long.';
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'A valid email address is required.';
  }
  if (!password || password.length < 6) {
    return 'Password must be at least 6 characters long.';
  }
  return null;
};

export const validateLoginInput = ({ email, password }) => {
  if (!email || !password) {
    return 'Email and password are required.';
  }
  return null;
};
