/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@/lib/prisma';
import { searchParamsCache } from '@/lib/searchparams';
// import { DataTable } from '@/components/ui/table/data-table';
// import { columns } from './product-tables/columns';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type ProductListingPage = {};

export default async function PostListingPage({}: ProductListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const pageLimit = searchParamsCache.get('limit');
  const categories = searchParamsCache.get('categories');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { categories: categories }),
  };

  const data = await prisma.post.findMany({
    include: {
      category: true,
    },
  });

  const totalProducts = data.length;

  //   return <DataTable columns={columns} data={data} totalItems={totalProducts} />;
  return <div>posts listing page via grid? flex? TODO: suitable ui element for posts pages.</div>;
}
