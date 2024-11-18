// src/app/api/user/verify-credentials/route.ts
import { NextResponse } from 'next/server';
import { setSessionCookie } from '@/features/auth/cookie';
import { verifyPasswordHash } from '@/features/auth/password';
import { createSession, generateRandomSessionToken } from '@/features/auth/session';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  const data = await req.json();
  // TODO: validate email & password.

  try {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: `User with ${data.email} has not signed up yet!` },
        { status: 404 },
      );
    } else {
      // Hash password before saving
      const validPassword = await verifyPasswordHash(user.passwordHash, data.password);
      if (!validPassword) {
        return NextResponse.json({ message: `Incorrect email or password!` }, { status: 404 });
      }

      // generate sessionToken and create session for user
      const sessionToken = generateRandomSessionToken();
      const session = await createSession(sessionToken, user.id);
      await setSessionCookie(sessionToken, session.expiresAt);
      revalidatePath('/sign-in', 'page');

      return NextResponse.json(
        { message: `${user.firstName} signed in successfuly` },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error('Error during sign up:', error);
  }
}
