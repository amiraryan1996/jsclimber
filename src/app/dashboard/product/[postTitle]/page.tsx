import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductViewPage from '../_components/product-view-page';

export const metadata = {
  title: 'Dashboard : Product View',
};

type PageProps = { params: { postTitle: string } };

export default function Page({ params }: PageProps) {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <ProductViewPage postTitle={params.postTitle} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
