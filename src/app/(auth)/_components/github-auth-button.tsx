'use client';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';

export default function GithubSignInButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const { toast } = useToast();

  const handleGitHubSignIn = async () => {
    console.log('Initiating GitHub sign-in...');
    try {
      const response = await signIn('github', {
        callbackUrl: callbackUrl ?? '/dashboard',
        redirect: false,
      });

      if (response?.error) {
        toast({
          variant: 'destructive',
          title: 'GitHub Login Error',
          description: response.error,
        });
        console.error('GitHub sign-in error:', response.error);
      } else if (response?.url === '/admin/signup') {
        toast({
          title: 'Redirecting to Signup',
          description: 'User not registered yet. Redirecting...',
        });
      } else {
        toast({
          title: 'Login Success',
          description: 'User logged in successfully.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'GitHub sign-in error:',
        description: 'GitHub Login Error',
      });
      console.error('GitHub sign-in error:', error);
    }
  };

  return (
    <Button className="w-full" variant="outline" onClick={handleGitHubSignIn}>
      <Icons.gitHub className="mr-2 h-4 w-4" />
      Continue with GitHub
    </Button>
  );
}
