import { NextResponse } from 'next/server';
import { getUserByEmailId } from '../../users/getUserByEmailId';

export async function POST(req: Request) {
  try {
    const { emailId } = await req.json();
    console.log('Checking if user exists with email:', emailId);

    const user = await getUserByEmailId(emailId);
    if (user) {
      console.log('User found:', user);
      return NextResponse.json(
        { userExists: true, message: 'User exists', status: 200 },
        { status: 200 },
      );
    } else {
      console.warn('User not found for email:', emailId);
      return NextResponse.json(
        { userExists: false, message: `User with ${emailId} does not exist`, status: 404 },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error('Error checking user existence:', error);
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        error: 'Error checking user existence',
        status: 500,
      },
      { status: 500 },
    );
  }
}
