import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';

const authConfig: NextAuthConfig = {
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
      //  credentials input fields will be rendered on the default sign in page
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async authorize(credentials, req) {
        console.log('Authorizing user with credentials:', credentials);
        const baseUrl = process.env.AUTH_URL;
        if (!credentials) return null;

        try {
          const res = await fetch(`${baseUrl}api/auth/verify-credentials`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              emailId: credentials.emailId,
              password: credentials.password,
            }),
          });

          const data = await res.json();
          if (!res.ok) {
            console.error('Authorization error:', data);
            throw new Error(data.message);
          }

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { user, status } = data;
          console.log('User found:', user);
          return user ? { id: user.id, name: user.name, email: user.email } : null;
        } catch (error) {
          console.error('Authorization request error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/signin',
  },
  secret: process.env.AUTH_SECRET,

  callbacks: {
    // check gitHub user's email existance in database
    async signIn({ account, profile }) {
      console.log('Sign-in callback triggered with account:', account);

      if (account?.provider === 'github') {
        const baseUrl = process.env.AUTH_URL;

        try {
          const res = await fetch(`${baseUrl}api/auth/check-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailId: profile?.email }),
          });

          const data = await res.json();
          if (!res.ok) {
            //! throw statement: statements after throw won't be executed
            console.error('check-user error:', data);
            throw new Error(data.message);
          }

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { userExists, status } = data;
          console.log('User existence check result:', userExists);

          if (!userExists) {
            console.warn('User not found in the database, redirecting to signup.');
            return '/signup';
          }
        } catch (error) {
          console.error('Error checking GitHub user in the database:', error);
          return false;
        }
      }
      return true;
    },
  },
};

export default authConfig;
