import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { adminAuth } from "./firebase-admin";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      id: "firebase",
      name: "Firebase",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          let userRecord;
          try {
            userRecord = await adminAuth.getUser(userCredential.user.uid);
          } catch {
            userRecord = await adminAuth.createUser({
              uid: userCredential.user.uid,
              email: userCredential.user.email,
              displayName: credentials.email.split("@")[0],
            });
          }

          return {
            id: userCredential.user.uid,
            email: userCredential.user.email,
            name:
              userCredential.user.displayName ||
              credentials.email.split("@")[0],
            role: userRecord.customClaims?.role || "user",
            accessToken: await userCredential.user.getIdToken(),
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id || user.sub || profile?.sub;
        token.role = user.role || "user";
        token.accessToken = account?.access_token || user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role || "user";
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
