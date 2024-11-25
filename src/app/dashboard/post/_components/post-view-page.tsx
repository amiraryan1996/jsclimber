import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PostForm from './post-form';

type TPostViewPageProps = {
  postTitle: string;
};
export default async function PostViewPage({ postTitle }: TPostViewPageProps) {
  let pageTitle = 'Create New Post';
  let post = null;
  const decodedPostTitle = decodeURIComponent(postTitle);
  if (decodedPostTitle !== 'new') {
    const data = await prisma.post.findFirst({
      where: { title: decodedPostTitle },
    });

    post = data;
    if (!data) {
      notFound();
    }
    pageTitle = `Edit Post`;
  }
  const categories = await prisma.category.findMany();
  return <PostForm initialData={post} pageTitle={pageTitle} categories={categories} />;
}
