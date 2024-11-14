import { Metadata } from 'next';
import { SignUpViewPage } from '../_components';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Authentication | Sign up',
  description: 'Sign Up page for authentication.',
};

export default function SignUp() {
  return (
    // TODO skeleton for SignUp
    <Suspense>
      <SignUpViewPage />
    </Suspense>
  );
}
