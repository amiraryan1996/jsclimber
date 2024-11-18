'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { debounce } from 'lodash';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { PasswordField } from '@/components/ui/PasswordField';
import { passwordSchema } from '../types/passwordSchema';
import { getUserByEmail } from '@/features/auth/services/get-user-by-email';
import { verifyCredentials } from '@/features/auth/services/verify-credentials';
import { useRouter } from 'next/navigation';
const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: passwordSchema,
});
type UserFormValue = z.infer<typeof formSchema>;

export default function UserSigninForm() {
  const form = useForm<UserFormValue>({
    mode: 'onBlur',
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const [userExists, setUserExists] = useState<boolean>(false);

  const handleEmailChange = debounce(async (email: string) => {
    const user = await getUserByEmail({ email });
    setUserExists(Boolean(user));
  }, 150);

  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data: UserFormValue) => {
    startTransition(() => verifyCredentials({ data, toast, router }));
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3" autoComplete="on">
          <FormField
            control={form.control}
            name="email"
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
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>
    </>
  );
}
