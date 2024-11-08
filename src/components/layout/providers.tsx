// !Context API is only available on the client:
'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
// !NextAuth SessionProvider is a client component, uses Context API, exported from next-auth/react not next-auth
import { SessionProvider, SessionProviderProps } from 'next-auth/react';
export default function Providers({
  session,
  children,
}: {
  session: SessionProviderProps['session']; // session expiry default times 30 days
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionProvider session={session}>{children}</SessionProvider>
      </ThemeProvider>
    </>
  );
}
