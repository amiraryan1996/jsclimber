'use client';
// Global Scope
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { GithubSignupButton } from './github-auth-button';
import { passwordSchema } from '../passwordSchema';
import { PasswordField } from '@/components/ui/PasswordField';
import { debounce } from 'lodash';
import { checkUserExistence } from '@/lib/utils';
import { useState } from 'react';

const FormSchema = z.object({
  name: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  emailId: z.string().email().min(5, {
    message: 'Enter a valid email address',
  }),
  password: passwordSchema,
});

// Function Scope
export function SignupForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      emailId: '',
      password: '',
    },
  });

  const router = useRouter();
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // Block Scope
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
          description: 'Redirecting to sign in page...',
        });
        router.push('/signin');
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

  // user Email validation state
  const [userExists, setUserExists] = useState<boolean>(true);
  const emailSchema = z.string().email();
  const handleEmailChange = debounce(async (email: string) => {
    const isValidEmail = emailSchema.safeParse(email).success;
    if (!isValidEmail) {
      // entered invalid mail => user exists(not green)
      setUserExists(true);
      return;
    }
    const exists = await checkUserExistence(email);
    setUserExists(exists);
  }, 150);

  const { toast } = useToast();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="john" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="emailId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  // disabled={loading}
                  placeholder="example@mail.com"
                  onChange={(e) => {
                    field.onChange(e);
                    handleEmailChange(e.target.value);
                  }}
                  className={`${
                    !userExists &&
                    'border-green-500 focus-visible:border-none focus-visible:ring-green-500'
                  }`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <PasswordField
          showStrength={true}
          name="password"
          placeholder="Enter password"
          // loading={loading}
        />
        <Button type="submit" className="w-full">
          Sign up
        </Button>
        <GithubSignupButton />
      </form>
    </Form>
  );
}
