import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '@/services/user/get-user-by-email';

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    console.error('Invalid request method:', req.method);
    return NextResponse.json(
      {
        message: 'Method Not Allowed',
        error: 'Only POST requests are allowed',
      },
      { status: 405 },
    );
  }

  try {
    const { email, password } = await req.json();
    console.log('Verifying credentials for email:', email);
    const baseUrl = process.env.AUTH_URL;
    const user = await getUserByEmail({ email, baseUrl });

    if (!user) {
      console.warn('User not found for email:', email);
      return NextResponse.json(
        { message: 'Invalid email or password', status: 401 },
        { status: 401 },
      );
    }

    const passwordMatches = bcrypt.compareSync(password, user.password);
    console.log('Password validation result:', passwordMatches);

    if (passwordMatches) {
      return NextResponse.json(
        {
          message: 'Authentication successful',
          user: { id: user.id, name: user.name, email: user.email },
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { message: 'Invalid email or password', status: 401 },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error('Error verifying credentials:', error);
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        error: 'Error verifying credentials:',
        status: 500,
      },
      { status: 500 },
    );
  }
}
