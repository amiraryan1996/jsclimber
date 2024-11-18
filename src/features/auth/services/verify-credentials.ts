import { TverifyCredentials } from '../types';

export async function verifyCredentials({ data, toast, router }: TverifyCredentials) {
  try {
    const response = await fetch('/api/user/verify-credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const verifyCredentialsData = await response.json();
    if (response.status === 200) {
      toast({
        title: 'sign in Success',
        description: verifyCredentialsData.message,
      });
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Sign in failed!',
        description: verifyCredentialsData.message,
      });
    }
  } catch (error) {
    console.error('Error during user sign in:', error);
    toast({
      variant: 'destructive',
      title: 'Server Error',
      description: 'An unexpected error occurred during sign in!',
    });
  }
}
