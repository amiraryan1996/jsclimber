import { TCreateUser } from '../types';
export async function createUser({ data, toast, router }: TCreateUser) {
  try {
    const response = await fetch('/api/user/create-user/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const createUserData = await response.json();
    if (response.status === 200) {
      toast({
        title: 'Signup Success',
        description: createUserData.message,
      });
      router.push('/dashboard');
    } else {
      toast({
        title: 'Sign up failed!',
        description: createUserData.message,
      });
    }
  } catch (error) {
    console.error('Error during user signup:', error);
    toast({
      variant: 'destructive',
      title: 'Server Error',
      description: 'An unexpected error occurred during signup!',
    });
  }
}
