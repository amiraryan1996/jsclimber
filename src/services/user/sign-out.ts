import { deleteSessionCookie } from '@/features/auth/cookie';

export const signOutUser = async () => {
  try {
    await deleteSessionCookie();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error('Error signing out user');
  }
};
