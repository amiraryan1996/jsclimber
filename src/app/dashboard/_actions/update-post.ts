// src/app/dashboard/_actions/update-post.ts
'use server';
import { prisma } from '@/lib/prisma';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function uploadePost(postId: string, data: Record<string, any>) {
  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...data,
      },
    });
    return updatedPost;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}
