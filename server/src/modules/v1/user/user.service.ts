import { db } from "@/config";

type User = { id: number; email: string };

export const allUsers = () => {
  const users = db.prepare("SELECT * FROM users").all();
  return users ;
};

export const findUserByEmail = (email: string): User | null => {
  const row = db
    .prepare("SELECT id, email FROM users WHERE email = ?")
    .get(email) as User | undefined;
  return row ?? null;
};