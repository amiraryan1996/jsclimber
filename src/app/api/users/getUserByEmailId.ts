import { User } from '@/app/interfaces/user';
import { apiGet } from '../database';

export const getUserByEmailId = async (emailId: string): Promise<User | null> => {
  try {
    const users = await apiGet(`SELECT * FROM users WHERE emailId = ?`, [emailId]);
    const user = (users as User[])[0] || null;
    return user;
  } catch (error) {
    console.error('Database error fetching user by email:', error);
    throw new Error('Database query failed');
  }
};
