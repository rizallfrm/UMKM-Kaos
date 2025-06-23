// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../lib/firebase";
import { adminAuth } from "../../../lib/firebase-admin";
import { doc, getDoc } from "firebase/firestore";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
    {
      id: "firebase",
      name: "Firebase",
      type: "credentials",
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

          // Verifikasi custom claims langsung dari Firebase Admin
          const user = await adminAuth.getUser(userCredential.user.uid);
          
          return {
            id: userCredential.user.uid,
            email: userCredential.user.email,
            name: userCredential.user.displayName,
            role: user.customClaims?.role || "user",
            accessToken: await userCredential.user.getIdToken(),
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    },
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      // Jika user login pertama kali
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      
      // Untuk request berikutnya, verifikasi role terbaru
      if (token.id && !token.forceRefresh) {
        try {
          const userRecord = await adminAuth.getUser(token.id);
          token.role = userRecord.customClaims?.role || "user";
        } catch (error) {
          console.error("Error refreshing user role:", error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});