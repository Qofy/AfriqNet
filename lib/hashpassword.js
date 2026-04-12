import bcrypt from 'bcryptjs';

export async function hashUserPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function verifyPassword(hashedPassword, suppliedPassword) {
  return await bcrypt.compare(suppliedPassword, hashedPassword);
} 