'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { passwordSchema } from '../types/passwordSchema';
import { PasswordField } from '@/components/ui/PasswordField';
import { debounce } from 'lodash';
import { useState, useTransition } from 'react';
import { getUserByEmail } from '@/features/auth/services/get-user-by-email';
import { createUser } from '@/features/auth/services/create-user';
import { useRouter } from 'next/navigation';

const FormSchema = z
  .object({
    firstName: z.string().min(2, {
      message: 'Username must be at least 2 characters.',
    }),
    lastName: z.string().min(2, {
      message: 'Username must be at least 2 characters.',
    }),
    email: z.string().email().min(5, {
      message: 'Enter a valid email address',
    }),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password == data.confirmPassword, {
    message: 'passwords doesnt match!',
    path: ['confirmPassword'],
  });

type signupDataType = z.infer<typeof FormSchema>;
// Function Scope
export function SignupForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

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

  const [loading, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const onSubmit = async (data: signupDataType) => {
    startTransition(() => createUser({ data, toast, router }));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
        <FormField
          control={form.control}
          name="firstName"
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
          name="lastName"
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
        <PasswordField showStrength={true} name="confirmPassword" placeholder="Enter password" />
        <Button type="submit" className="w-full">
          {loading ? 'Signing up' : 'Sign up'}
        </Button>
      </form>
    </Form>
  );
}
