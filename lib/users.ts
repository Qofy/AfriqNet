import { createUser, getUserByEmail } from "./db.server";

interface User {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  [key: string]: unknown;
}

export async function createUsers(name: string, email: string, passwordHash: string): Promise<Record<string, unknown>> {
  // Use the helper from db.server which has correct column names
  return await createUser({ name, email, passwordHash });
}

export async function getUserByEmailWrapper(email: string): Promise<Record<string, unknown> | null> {
  return await getUserByEmail(email);
}