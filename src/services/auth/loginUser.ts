import { signIn } from 'next-auth/react';
import { UserFormValue } from '@/app/(auth)/_components/sign-in/user-signin-form';

export function loginUser(
  data: UserFormValue,
  callbackUrl: string | null,
  toast: ({ ...props }) => {
    id: string;
    dismiss: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update: (props: any) => void;
  },
) {
  signIn('credentials', {
    email: data.email,
    password: data.password,
    callbackUrl: callbackUrl ?? '/dashboard',
    redirect: false,
  })
    .then((response) => {
      if (response?.error) {
        toast({
          variant: 'destructive',
          title: 'Login error',
          description: response.error,
        });
        console.error('Login error:', response.error);
      }
      if (response?.ok && response?.url) {
        toast({
          title: 'Login Success',
          description: 'Redirecting to Dashboard...',
        });
        window.location.href = response.url;
      }
    })
    .catch((error) => {
      toast({
        variant: 'destructive',
        title: 'Login error',
        description: error.message || 'An error occurred during Login.',
      });
      console.error('Login error:', error);
    });
}
