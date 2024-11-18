import { Metadata } from 'next';
import { SignInViewPage } from '@/features/auth/components';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Authentication | Sign In',
  description: 'Sign In page for authentication.',
};

export default function SignIn() {
  return (
    // TODO skeleton for Sign ip
    <Suspense>
      <SignInViewPage />
    </Suspense>
  );
}
