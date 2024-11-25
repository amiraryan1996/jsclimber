'use server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/features/auth/cookie';
// TODO: returned response message and notification handling.
export async function deletePost(postId: string) {
  const { user } = await getAuth();

  if (!user) {
    throw new Error('Unauthorized: Please log in.');
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new Error('Post not found.');
  }

  if (post.authorId !== user.id) {
    throw new Error('Forbidden: You are not allowed to delete this post.');
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  return { success: true, message: 'Post deleted successfully.' };
}
