'use server';
import { getAuth as gA } from '@/features/auth/cookie';

export const getAuth = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { session, user } = await gA();
  return user;
};
