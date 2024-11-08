import { signupDataType } from '@/app/(auth)/_components/signup/user-signup-form';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export async function signupUser(
  data: signupDataType,
  toast: ({ ...props }) => {
    id: string;
    dismiss: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update: (props: any) => void;
  },
  router: AppRouterInstance,
) {
  // block scope
  try {
    // ! Next Fns, fetch:  https://nextjs.org/docs/app/api-reference/functions/fetch
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    // true: (status in the range 200-299)
    if (response.ok) {
      const data = await response.json();
      toast({
        title: data.message,
        description: 'Redirecting to Dashboard...',
      });
      router.push('/dashboard');
    } else {
      const data = await response.json();
      toast({
        variant: 'destructive',
        title: data.message,
        description: data.error,
      });
    }
  } catch (error) {
    console.error(error);
    toast({
      variant: 'destructive',
      title: 'Server error',
      description: 'An unexpected error occurred',
    });
  }
}
