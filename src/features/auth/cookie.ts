// src/features/auth/cookie.ts
import { cookies } from 'next/headers';
import { validateSession } from './session';
export const SESSION_COOKIE_NAME = 'session';

export const setSessionCookie = async (sessionToken: string, expiresAt: Date) => {
  const cookieStore = cookies();
  const cookie = {
    name: SESSION_COOKIE_NAME,
    value: sessionToken,
    attributes: {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: expiresAt,
    },
  };

  cookieStore.set(cookie.name, cookie.value, cookie.attributes);
};

export const deleteSessionCookie = async () => {
  const cookieStore = cookies();
  const cookie = {
    name: SESSION_COOKIE_NAME,
    value: '',
    attributes: {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    },
  };

  cookieStore.set(cookie.name, cookie.value, cookie.attributes);
};

// ssr
export const getAuth = async () => {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return { session: null, user: null };
  }

  const { session, user } = await validateSession(sessionToken);
  if (!session || !user) {
    // Optionally, delte session cookie for invalid session.
    deleteSessionCookie();
    return { session: null, user: null };
  }

  return { session, user };
};
