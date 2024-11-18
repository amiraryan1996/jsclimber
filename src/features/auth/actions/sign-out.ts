// src/features/auth/actions/sign-out.ts
'use server';
import { redirect } from 'next/navigation';
import { getAuth, deleteSessionCookie } from '@/features/auth/cookie';
import { invalidateSession } from '@/features/auth/session';
import { revalidatePath } from 'next/cache';

export const signOut = async () => {
  const { session } = await getAuth();

  if (!session) {
    redirect('/sign-in');
  }

  await invalidateSession(session.id);
  await deleteSessionCookie();
  revalidatePath('/dashboard', 'layout');

  redirect('/sign-in');
};
