import { createUser, getUserByEmail } from "./db.server.js";

export function createUsers(name, email, passwordHash) {
  // Use the helper from db.server.js which has correct column names
  return createUser({ name, email, passwordHash });
}

export default function  getUserByEmailWrapper(email) {
  return getUserByEmail(email);
}