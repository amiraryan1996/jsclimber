// src/app/api/user/create-user/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { hashPassword } from '@/features/auth/password';
import { generateRandomSessionToken, createSession } from '@/features/auth/session';
import { setSessionCookie } from '@/features/auth/cookie';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  const data = await req.json();
  // TODO: validate firstName, lastName, email, password and confirmpassword.

  try {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (user) {
      return NextResponse.json(
        { message: `User with ${data.email} has been already signed up!` },
        { status: 404 },
      );
    } else {
      // Hash password before saving
      const passwordHash = await hashPassword(data.password);
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          passwordHash,
        },
      });
      console.log(`User ${newUser.firstName} with email ${newUser.email} signed up`);

      //  generate sessionToken and create session for user
      const sessionToken = generateRandomSessionToken();
      const session = await createSession(sessionToken, newUser.id);
      await setSessionCookie(sessionToken, session.expiresAt);
      revalidatePath('/sign-up', 'layout');

      return NextResponse.json(
        { message: `User ${newUser.firstName} created with email ${newUser.email}` },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error('Error during sign up:', error);
  }
}
