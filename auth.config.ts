import { NextAuthConfig } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";

const authConfig: NextAuthConfig = {
  providers: [
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

        if (!credentials) return null;

        try {
          const res = await fetch(
            "http://localhost:3000/api/auth/verify-credentials",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                emailId: credentials.emailId,
                password: credentials.password,
              }),
            }
          );

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

  // TODO: *Spoofing Attacks* add jsclimber.com domain in production trusted only!
  // ! https://authjs.dev/reference/core/errors#untrustedhost
  // trustHost: true,
};

export default authConfig;
