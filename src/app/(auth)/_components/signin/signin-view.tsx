import Link from 'next/link';
import Image from 'next/image';
import { UserSigninForm } from './user-signin-form';

export function SignInViewPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 dark:border-r lg:flex">
        <div className="absolute inset-0" />

        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Logo
        </div>
        <Image
          src="https://dummyimage.com/600x800/800080/fff.png&text=Sign in+page"
          alt="Sign in"
          width={400}
          height={800}
          className="m-auto"
        />
        <div className="relative z-20">
          <blockquote className="space-y-2">
            <p className="text-lg">Dashboard explaination here...</p>
            <footer className="text-sm">owner / company</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to Sign in your account
            </p>
          </div>
          <UserSigninForm />
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
