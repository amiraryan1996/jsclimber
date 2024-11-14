// src/app/api/user/create-user/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const data = await req.json();
  try {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (user) {
      return NextResponse.json(
        { message: `User with ${data.email} has already signed up!` },
        { status: 404 },
      );
    } else {
      // Hash password before saving
      const hashedPassword = await bcrypt.hash(data.password, 10);
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
        },
      });
      console.log(`User ${newUser.name} created with email ${newUser.email}`);
      return NextResponse.json(
        { message: `User ${newUser.name} created with email ${newUser.email}` },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error('Error during user signup:', error);
  }
}
