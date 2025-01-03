import { notFound } from 'next/navigation';
import ProductForm from './product-form';
import { prisma } from '@/lib/prisma';

type TPostViewPageProps = {
  postTitle: string;
};

export default async function ProductViewPage({ postTitle }: TPostViewPageProps) {
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
    // console.log('dynamic post title route with post:', post);
  }
  const categories = await prisma.category.findMany();
  return <ProductForm initialData={post} pageTitle={pageTitle} categories={categories} />;
}
