'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useAppStore, useTokenStore } from '../../../store';
import Link from 'next/link';
import { Github } from 'lucide-react';

const FormSchema = z.object({
  emailId: z.string().email().min(5, {
    message: 'Email must be at least 5 characters and valid email format.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

export default function LoginForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      emailId: '',
      password: '',
    },
  });
  const { toast } = useToast();
  const router = useRouter();
  const setToken = useTokenStore((state) => state.setToken);
  const setIsAuthenticated = useAppStore((state) => state.setIsAuthenticated);
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // ! Next Fn's, fetch:  https://nextjs.org/docs/app/api-reference/functions/fetch
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      // true: (status in the range 200-299)
      if (response.ok) {
        const { token } = await response.json();
        setToken(token);
        setIsAuthenticated(true);
        toast({
          title: 'Login result:',
          description: 'Logged in successfully ',
        });
        router.push('/admin');
      } else {
        const data = await response.json();
        toast({
          variant: 'destructive',
          title: 'Login result:',
          description: data.message,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
        <FormField
          control={form.control}
          name="emailId"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Email</FormLabel> */}
              <FormControl>
                <Input placeholder="johnsmith@gmail.com" {...field} />
              </FormControl>
              <FormDescription>{/* This is your public display name. */}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-2">
          <div className="flex items-center">
            <Link
              href="/forgot-password"
              className="ml-auto inline-block text-sm underline opacity-10"
            >
              Forgot your password?
            </Link>
          </div>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Password</FormLabel> */}
                <FormControl>
                  <Input placeholder="password..." {...field} />
                </FormControl>
                <FormDescription>{/* This is your public display name. */}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />{' '}
        </div>

        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button disabled variant="outline" className="w-full">
          <Github className="size-8 rounded-full bg-black text-white" />
          Github
        </Button>
      </form>
    </Form>
  );
}
