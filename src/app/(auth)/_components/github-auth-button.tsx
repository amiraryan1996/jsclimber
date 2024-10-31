"use client";

import { useSearchParams } from "next/navigation";
// signIn, sends user to signin page listing all possible providers.
// signIn, Handles CSRF protection.
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export default function GithubSignInButton() {
  // client Component, to read current URL's query string.
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={() => {
        console.log("Initiating GitHub sign-in...");
        signIn("github", { callbackUrl: callbackUrl ?? "/dashboard" })
          .then((response) => {
            console.log("GitHub sign-in response:", response);
          })
          .catch((error) => console.error("GitHub sign-in error:", error));
      }}
    >
      <Icons.gitHub className="mr-2 h-4 w-4" />
      Continue with Github
    </Button>
  );
}
