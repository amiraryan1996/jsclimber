// ./src/auth.ts
import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import authConfig from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig satisfies NextAuthConfig);
