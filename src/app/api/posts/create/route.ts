// src/app/api/post/create/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { title, description, image, categoryId, userId } = await req.json();

  try {
    const post = await prisma.post.create({
      data: {
        title,
        description,
        image,
        categoryId,
        authorId: userId,
      },
    });
    return NextResponse.json({ message: 'Post created', post }, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Post creation failed' }, { status: 500 });
  }
}
