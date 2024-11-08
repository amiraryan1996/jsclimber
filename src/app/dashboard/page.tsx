import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function Dashboard() {
  const session = await auth();
  console.log('--------------Session:-----------' + session);
  if (!session?.user) {
    return redirect('/');
  } else {
    redirect('/dashboard/overview');
  }
}
