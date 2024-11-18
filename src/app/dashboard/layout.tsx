// src/app/dashboard/layout.tsx
import AppSidebar from '@/components/layout/app-sidebar';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAuth } from '@/features/auth/cookie';

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn',
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getAuth();
  console.log('getAuth res from dashboard layout, user:', user);
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <>
      <AppSidebar>{children}</AppSidebar>
    </>
  );
}
