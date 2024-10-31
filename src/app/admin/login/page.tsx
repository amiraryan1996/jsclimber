import Link from "next/link";
import LoginForm from "./components";
import LoginSvg from "../../assets/svg/Login-amico.svg";

// ?UI Template: https://github.com/shadcn-ui/ui/blob/500a353816969e3cce2b3f4f0699ce4e6ad06f0b/apps/www/registry/default/block/authentication-04.tsx#L19

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:h-screen lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/admin/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:flex items-center">
        <LoginSvg className="m-auto" />
      </div>
    </div>
  );
}
