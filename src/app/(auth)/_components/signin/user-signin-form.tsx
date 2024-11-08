'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { debounce } from 'lodash';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { PasswordField } from '@/components/ui/PasswordField';
import { passwordSchema } from '../passwordSchema';
import { checkUserExistence } from '@/lib/utils';
import GithubAuthButton from '../github-auth-button';
import { loginUser } from '@/services/auth';

const formSchema = z.object({
  emailId: z.string().email({ message: 'Enter a valid email address' }),
  password: passwordSchema,
});
export type UserFormValue = z.infer<typeof formSchema>;

export function UserSigninForm() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, startTransition] = useTransition();

  const form = useForm<UserFormValue>({
    mode: 'onBlur',
    resolver: zodResolver(formSchema),
    defaultValues: { emailId: '', password: '' },
  });

  const [userExists, setUserExists] = useState<boolean>(false);
  const emailSchema = z.string().email();

  const handleEmailChange = debounce(async (email: string) => {
    const isValidEmail = emailSchema.safeParse(email).success;
    // logical NOT operator: reverses the truthness of the value
    if (!isValidEmail) {
      setUserExists(false);
      return;
    }
    const exists = await checkUserExistence(email);
    setUserExists(exists);
  }, 150);

  const onSubmit = async (data: UserFormValue) => {
    console.log('Submitting login with data:', data);
    startTransition(() => {
      loginUser(data, callbackUrl, toast);
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3" autoComplete="on">
          <FormField
            control={form.control}
            name="emailId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    disabled={loading}
                    placeholder="example@mail.com"
                    autoComplete="on"
                    onChange={(e) => {
                      field.onChange(e);
                      handleEmailChange(e.target.value);
                    }}
                    className={`${
                      userExists &&
                      'border-green-500 focus-visible:border-none focus-visible:ring-green-500'
                    }`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-2">
            <Link
              href="/forgot-password"
              className="ml-auto inline-block text-sm underline opacity-10"
            >
              Forgot your password?
            </Link>
            <PasswordField
              showStrength={true}
              name="password"
              placeholder="Enter password"
              loading={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <GithubAuthButton />
    </>
  );
}
