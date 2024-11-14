'use client';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export default function GithubAuthButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const handleGitHubSignIn = async () => {
    console.log('Initiating GitHub sign-in...');
    await signIn('github', {
      callbackUrl: callbackUrl ?? '/dashboard',
    });
  };

  return (
    <Button className="w-full" variant="outline" onClick={handleGitHubSignIn}>
      <Icons.gitHub className="mr-2 h-4 w-4" />
      Continue with GitHub
    </Button>
  );
}
