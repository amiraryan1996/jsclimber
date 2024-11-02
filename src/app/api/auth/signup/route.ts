// /api/auth/signup

import { apiPost } from '../../database';
import { NextResponse } from 'next/server';
// ?bcrypt A library to hash passwords.
import bcrypt from 'bcrypt';

// !route handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers.
export async function POST(req: Request) {
  const { name, emailId, password } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `INSERT INTO users (name, emailId, password) VALUES (?, ?, ?)`;
  const params = [name, emailId, hashedPassword];

  try {
    await apiPost(query, params);
    console.log(`User ${name} created successfully with email ${emailId}`);
    return NextResponse.json({ message: 'User created successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error during user creation:', error);

    // !Type assertion
    const errorMessage = (error as Error).message || 'An unknown error occurred';

    return NextResponse.json({ message: 'Signup failed', error: errorMessage }, { status: 400 });
  }
}
