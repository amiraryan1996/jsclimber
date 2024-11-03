import { Metadata } from 'next';
import { SignUpViewPage } from '../_components';

export const metadata: Metadata = {
  title: 'Authentication | Sign up',
  description: 'Sign Up page for authentication.',
};

export default function Signup() {
  return <SignUpViewPage />;
}
