import { Metadata } from 'next';
import { SignInViewPage } from '../_components';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Authentication | Sign In',
  description: 'Sign In page for authentication.',
};

export default function SignIn() {
  return (
    // TODO skeleton for SignUp
    <Suspense>
      <SignInViewPage />
    </Suspense>
  );
}
