'use client';
// Global Scope
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { passwordSchema } from '../passwordSchema';
import { PasswordField } from '@/components/ui/PasswordField';
import { debounce } from 'lodash';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createUser } from '@/services/user/create-user';
import { loginUser } from '@/services/auth';
import { getUserByEmail } from '@/services/user/get-user-by-email';

const FormSchema = z.object({
  name: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z.string().email().min(5, {
    message: 'Enter a valid email address',
  }),
  password: passwordSchema,
});

export type signupDataType = z.infer<typeof FormSchema>;
// Function Scope
export function SignupForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const { toast } = useToast();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  async function onSubmit(data: signupDataType) {
    const isRegistered = await createUser({ data, toast });
    if (isRegistered === true) {
      loginUser(data, callbackUrl, toast);
    }
  }

  const [userExists, setUserExists] = useState<boolean>(true);

  const handleEmailChange = debounce(async (email: string) => {
    const emailSchema = z.string().email();
    const isValidEmail = emailSchema.safeParse(email).success;
    if (!isValidEmail) {
      setUserExists(true);
      return;
    }
    const user = await getUserByEmail({ email });
    setUserExists(Boolean(user));
  }, 150);

  return (
    // TODO: Sign up skeleton.
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="email"
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
        <PasswordField showStrength={true} name="password" placeholder="Enter password" />
        <Button type="submit" className="w-full">
          Sign up
        </Button>
      </form>
    </Form>
  );
}
