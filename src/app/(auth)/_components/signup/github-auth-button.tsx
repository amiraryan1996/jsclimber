'use client';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export function GithubSignupButton() {
  const handleGitHubSignUp = async () => {
    console.log('Redirecting to GitHub for sign-up...');
    // Redirect to GitHub for OAuth sign-in.
    // handle user existence and redirection post-sign-in.
    await signIn('github', {
      callbackUrl: '/api/auth/github-callback',
    });
  };

  return (
    <Button className="w-full" variant="outline" onClick={handleGitHubSignUp}>
      <Icons.gitHub className="mr-2 h-4 w-4" />
      Continue with GitHub
    </Button>
  );
}
