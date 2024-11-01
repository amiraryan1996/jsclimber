import { NextAuthConfig } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";

const authConfig: NextAuthConfig = {
  providers: [
    // github: signIn('github', { callbackUrl: callbackUrl ?? '/dashboard' })
    // https://next-auth.js.org/providers/github#configuration
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    CredentialProvider({
      credentials: {
        emailId: { type: "email" },
        password: { type: "password" },
      },
      //  credentials input fields will be rendered on the default sign in page
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async authorize(credentials, req) {
        console.log("Authorizing user with credentials:", credentials);
        const baseUrl = process.env.AUTH_URL;
        if (!credentials) return null;

        try {
          const res = await fetch(`${baseUrl}api/auth/verify-credentials`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              emailId: credentials.emailId,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            console.error("Authorization error:", errorData);
            throw new Error(errorData.message || "Authorization failed");
          }

          const user = await res.json();
          console.log("User found:", user);
          return user
            ? { id: user.id, name: user.name, email: user.emailId }
            : null;
        } catch (error) {
          console.error("Authorization request error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  secret: process.env.AUTH_SECRET,

  callbacks: {
    async signIn({ account, profile }) {
      console.log("Sign-in callback triggered with account:", account);

      if (account?.provider === "github") {
        const baseUrl = process.env.AUTH_URL;

        try {
          // Verify GitHub user's email exists in the database
          const res = await fetch(`${baseUrl}api/auth/check-user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emailId: profile?.email }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            console.error("check-user error:", errorData);
            throw new Error(errorData.message || "check-user failed");
          }

          const { userExists } = await res.json();
          console.log("User exists in the database:", userExists);

          // Redirect to signup page if user does not exist
          if (!userExists) {
            console.warn(
              "User not found in the database, redirecting to signup."
            );
            return "/admin/signup";
          }
        } catch (error) {
          console.error("Error checking GitHub user in the database:", error);
          return false;
        }
      }
      return true;
    },
  },
};

export default authConfig;
