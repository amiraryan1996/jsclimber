// src/app/dashboard/post/_actions/create-post.ts
'use server';
import { getAuth } from '@/features/auth/actions/get-auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export const createPage = async (data: {
  content: string;
  title: string;
  description: string;
  categoryId: string;
}) => {
  try {
    const user = await getAuth();
    console.log('getAuth res from dashboard layout, user:', user);
    if (!user) {
      console.error('authentication falied redirecting to sign in page...');
      redirect('/sign-in');
    } else {
      await prisma.page.create({
        data: {
          title: data.title,
          description: data.description,
          categoryId: data.categoryId,
          authorId: user.id,
          content: data.content,
        },
      });
      console.log('post page created successfully.');
    }
  } catch (error) {
    console.log('error while creating new post page...', error);
  }
};
