// /api/auth/login

import { getUserByEmailId } from '../../users/getUserByEmailId';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// !route handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers.
export async function POST(req: Request) {
  const body = await req.json();
  const { emailId, password } = body;
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT_SECRET environment variable is not defined');
    throw new Error('JWT_SECRET is not defined');
  }

  try {
    const user = await getUserByEmailId(emailId);
    if (user) {
      console.log('User found:', user);
    } else {
      console.log('User not found for email:', emailId);
    }

    // Password comparison
    const isMatch = user && (await bcrypt.compare(password, user.password));
    if (isMatch) {
      const token = jwt.sign({ id: user.id }, jwtSecret);
      console.log('Password match, token generated:', token);
      return NextResponse.json({ token }, { status: 200 });
    } else {
      console.log('Password does not match or user not found.');
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ message: 'Login failed' }, { status: 401 });
  }
}
