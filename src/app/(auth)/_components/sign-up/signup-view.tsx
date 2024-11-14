import Link from 'next/link';
import { SignupForm } from './user-signup-form';
import Image from 'next/image';

// ?UI Template: https://github.com/shadcn-ui/ui/blob/500a353816969e3cce2b3f4f0699ce4e6ad06f0b/apps/www/registry/default/block/authentication-04.tsx#L19
export function SignUpViewPage() {
  return (
    <div className="relative flex-grow flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
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
          src="https://dummyimage.com/600x800/800080/fff.png&text=Sign up+page"
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
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">Sign up</h1>
            <p className="text-balance text-muted-foreground">
              Fill the form below to register an account.
            </p>
          </div>
          <SignupForm />
          <div className="text-center text-sm">
            Alreay have an account?{' '}
            <Link href="/sign-in" className="underline">
              Sign in
            </Link>
            <p className="mt-1 px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{' '}
              <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
