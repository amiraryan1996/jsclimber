// src/app/api/auth/[...nextauth]/route.ts
// [...nextauth]: catch-all dynamic route => will respond to all the relevant auth routes.
// https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes#catch-all-segments
import { handlers } from '@/auth';
console.log('Setting up auth route handlers');
// it will manage both types of HTTP requests for auth routes: login, signup, ...
// handler exported GET and POST:
export const { GET, POST } = handlers;
