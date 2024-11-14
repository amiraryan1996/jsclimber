// https://next-auth.js.org/configuration/initialization#route-handlers-app
import NextAuth from 'next-auth';
import { verifyCredentials } from '@/services/auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { createUser } from '@/services/user/create-user';
import { getUserByEmail } from '@/services/user/get-user-by-email';

const handler = NextAuth({
  // trustHost: process.env.AUTH_TRUST_HOST === 'true',
  // https://authjs.dev/getting-started/adapters/prisma
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
    CredentialProvider({
      credentials: {
        email: { type: 'email' },
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
    signIn: '/sign-in',
  },
  secret: process.env.AUTH_SECRET,

  callbacks: {
    async signIn({ account, profile }) {
      console.log('Sign-in callback triggered with profile:', profile);
      if (account?.provider === 'github') {
        const baseUrl = process.env.AUTH_URL as string;
        try {
          const email = profile?.email ?? '';

          //  STEP1: check user exists
          const user = await getUserByEmail({ email, baseUrl });
          console.log('User check result from [...nextauth] route handler:', user);

          //  STEP2: if user doesnt exists => create user
          if (!user && profile) {
            const data = {
              name: profile.name as string,
              email: profile.email as string,
              password: '',
            };
            const isRegistered = await createUser({ data, baseUrl });
            if (!isRegistered) throw new Error('Failed to create user during signup.');
          }

          //  STEP3: recieve user information after register
          const newUser = await getUserByEmail({ email, baseUrl });
          console.log('User check result after create user:', newUser);

          // STEP4: check if user is linked to an account
          console.log('checking existingaccount: ', 'account:', account, 'userId:', newUser.id);
          const existingAccount = (await prisma.account.findFirst({
            where: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              userId: newUser.id,
            },
          })) as unknown;
          console.log(' existingaccount: ', existingAccount);

          // STEP5: if user isnt linked to account => create account
          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: newUser.id,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                type: account.type || 'oauth',
              },
            });
            console.log('GitHub account linked to existing user:', email);
          }
        } catch (error) {
          console.error('Error checking GitHub user in database:', error);
          return false;
        }
      }
      console.log('user signed in successfully');
      return true;
    },
  },

  debug: true,
  // When using "database", the session cookie will only contain a sessionToken value, which is used to look up the session in the database.
  // session: {
  //   strategy: 'jwt',
  //   maxAge: 432000, // 5days
  // },
});
export { handler as GET, handler as POST };
