import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getUserByEmailId } from '../../users/getUserByEmailId';

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
    const { emailId, password } = await req.json();
    console.log('Verifying credentials for email:', emailId);

    const user = await getUserByEmailId(emailId);
    if (!user) {
      console.warn('User not found for email:', emailId);
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
          user: { id: user.id, name: user.name, email: user.emailId },
          status: 200,
        },
        { status: 200 },
      );
      // return NextResponse.json(
      //       {
      //         id: user.id,
      //         name: user.name,
      //         email: user.emailId,
      //       },
      //       { status: 200 }
      //     );
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
