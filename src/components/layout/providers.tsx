// !Context API is only available on the client:
'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
// !NextAuth SessionProvider is a client component, uses Context API, exported from next-auth/react not next-auth
import { SessionProvider } from 'next-auth/react';
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionProvider>{children}</SessionProvider>
      </ThemeProvider>
    </>
  );
}
