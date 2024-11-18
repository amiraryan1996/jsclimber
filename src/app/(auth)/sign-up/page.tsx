import { Metadata } from 'next';
import { SignUpViewPage } from '@/features/auth/components';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Authentication | Sign up',
  description: 'Sign Up page for authentication.',
};

export default function SignUp() {
  return (
    // TODO: sign up skeleton
    <Suspense>
      <SignUpViewPage />
    </Suspense>
  );
}
