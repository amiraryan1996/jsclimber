import { checkUserExists, registerUser, verifyCredentials } from '@/services/auth';
import type { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
// import { SQLiteAdapter } from './services/auth/SqliteAdapter';

const authConfig: NextAuthConfig = {
  trustHost: process.env.AUTH_TRUST_HOST === 'true',
  // adapter: SQLiteAdapter(),
  providers: [
    // https://next-auth.js.org/providers/github#configuration
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
    CredentialProvider({
      credentials: {
        emailId: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        console.log('Authorizing user with credentials:', credentials);
        const baseUrl = process.env.AUTH_URL;
        return await verifyCredentials(credentials, baseUrl);
      },
    }),
  ],
  pages: {
    signIn: '/signin',
  },
  secret: process.env.AUTH_SECRET,

  callbacks: {
    async signIn({ account, profile }) {
      console.log('Sign-in callback triggered with account:', account);
      if (account?.provider === 'github') {
        const baseUrl = process.env.AUTH_URL ?? '';
        if (!baseUrl) {
          throw new Error('AUTH_URL is not defined in the environment variables.');
        }
        // Step 1: Parse intent from the account state
        // const state = account?.state ? JSON.parse(account.state.toString()) : {};
        // const intent = state?.intent;
        // console.log(`GitHub sign-in initiated with intent: ${intent}`);

        // Step 1:Parse state if it exists and ensure JSON parsing is done safely
        let intent;
        if (account?.state) {
          try {
            const stateData = JSON.parse(account.state as string); // I'm sure state is string.
            intent = stateData.intent;
          } catch (error) {
            console.error('Failed to parse state data:', error);
          }
        }
        console.log(`GitHub sign-in initiated with intent: ${intent}`);

        try {
          // Step 2: Check if the user exists in the database
          const userExists = await checkUserExists(profile?.email ?? '', baseUrl);
          console.log('User existence check result:', userExists);

          if (!userExists && intent == '/signin') {
            console.warn('User not found, redirecting to signup page... .');
            return '/signup';
          }
          if (userExists && intent == '/signup') {
            console.warn('User found, redirecting to signin page... .');
            return '/signin';
          }
          if (!userExists && intent === '/signup' && profile) {
            const isRegistered = await registerUser(profile, baseUrl);
            if (!isRegistered) throw new Error('Failed to register user during signup.');
          }
        } catch (error) {
          console.error('Error checking GitHub user in database:', error);
          return false;
        }
      }
      console.log('user signed in successfully');
      return true;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },

  debug: true,
  // debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
    // how long (seconds) a user's session is valid before expiring
    maxAge: 432000, // 5days
  },
};

export default authConfig;
