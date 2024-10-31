"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import GithubSignInButton from "./github-auth-button";
import Link from "next/link";

const formSchema = z.object({
  emailId: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});
type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [loading, startTransition] = useTransition();
  const defaultValues = {
    emailId: "amir.ariyan.deeev@gmail.com",
    password: "12345678",
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {
    console.log("Submitting login with data:", data);
  
    startTransition(() => {
      signIn("credentials", {
        emailId: data.emailId,
        password: data.password,
        callbackUrl: callbackUrl ?? "/dashboard",
      }).then((response) => {
        console.log("Sign-in response:", response);
        if (response?.error) {
          console.error("Sign-in error:", response.error);
        }
      });
    });
  };
  //   try {
  //     const response = await fetch("/api/auth/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(data),
  //     });

  //     if (response.ok) {
  //       const { token } = await response.json();
  //       setToken(token);
  //       setIsAuthenticated(true);
  //       toast.success("Signed In Successfully!");
  //       router.push(callbackUrl ?? "/dashboard");
  //     } else {
  //       const errorData = await response.json();
  //       toast.error(`Login failed: ${errorData.message}`);
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     toast.error("An unexpected error occurred during login.");
  //   }
  // };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
          <FormField
            control={form.control}
            name="emailId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    disabled={loading}
                    placeholder="johnsmith@gmail.com"
                    {...field}
                  />
                </FormControl>

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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={loading}
                      placeholder="john$30na"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />{" "}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <GithubSignInButton />
    </>
  );
}
