/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/users/create-user.ts
import { signupDataType } from '@/app/(auth)/_components/sign-up/user-signup-form';

export async function createUser({
  data,
  baseUrl = '',
  toast,
}: {
  data: signupDataType;
  baseUrl?: string;
  toast?: ({ ...props }: any) => {
    id: string;
    dismiss: () => void;
    update: (props: any) => void;
  };
}) {
  try {
    const response = await fetch(`${baseUrl}/api/user/create-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const registerData = await response.json();
    if (response.status === 200) {
      if (toast) {
        toast({
          title: 'Signup Success',
          description: registerData.message,
        });
      }
      return true;
    } else {
      if (toast) {
        toast({
          title: 'Sign up failed!',
          description: registerData.message,
        });
      }
    }
    return false;
  } catch (error) {
    console.error('Error during user signup:', error);
    if (toast) {
      toast({
        variant: 'destructive',
        title: 'Server Error',
        description: 'An unexpected error occurred during signup!',
      });
    }
  }
}
