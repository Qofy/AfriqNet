import bcrypt from 'bcryptjs';

export async function hashUserPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function verifyPassword(hashedPassword: string, suppliedPassword: string): Promise<boolean> {
  return await bcrypt.compare(suppliedPassword, hashedPassword);
} 