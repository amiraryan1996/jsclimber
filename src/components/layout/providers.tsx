"use client";
import React from "react";
import ThemeProvider from "./ThemeToggle/theme-provider";
import { SessionProvider, SessionProviderProps } from "next-auth/react";
// import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function Providers({
  session,
  children,
}: {
  session: SessionProviderProps["session"];
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionProvider session={session}>
          {children}
          {/*  https://nuqs.47ng.com/blog/nuqs-2 */}
          {/* <NuqsAdapter></NuqsAdapter> */}
        </SessionProvider>
      </ThemeProvider>
    </>
  );
}
