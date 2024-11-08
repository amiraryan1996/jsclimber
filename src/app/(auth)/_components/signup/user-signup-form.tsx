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
import { passwordSchema } from '../passwordSchema';
import { PasswordField } from '@/components/ui/PasswordField';
import { debounce } from 'lodash';
import { checkUserExistence } from '@/lib/utils';
import { useState } from 'react';
import GithubAuthButton from '../github-auth-button';
import { signupUser } from '@/services/auth';

const FormSchema = z.object({
  name: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  emailId: z.string().email().min(5, {
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
      emailId: '',
      password: '',
    },
  });

  const router = useRouter();
  async function onSubmit(data: signupDataType) {
    await signupUser(data, toast, router);
  }

  // user Email validation state
  const [userExists, setUserExists] = useState<boolean>(true);
  const emailSchema = z.string().email();

  const handleEmailChange = debounce(async (email: string) => {
    const isValidEmail = emailSchema.safeParse(email).success;
    if (!isValidEmail) {
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
        <GithubAuthButton />
      </form>
    </Form>
  );
}
