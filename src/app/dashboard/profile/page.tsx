import { SearchParams } from 'nuqs/parsers';
import ProfileViewPage from './_components/profile-view-page';

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Profile',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function Page({ searchParams }: pageProps) {
  return <ProfileViewPage />;
}
