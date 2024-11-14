import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email } = await req.json();
  console.log('get-user-by-email route handler:', email);

  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (user) {
    return NextResponse.json({ user: user, message: `User with ${email} found.` }, { status: 200 });
  } else {
    console.warn('User not found');
    return NextResponse.json(
      { message: 'Invalid email or password', status: 401 },
      { status: 401 },
    );
  }
}
