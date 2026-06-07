import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 Jam inactivity logout
    updateAge: 0, // Update session setiap kali ada request (Sliding Session)
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      
      // We can also store/update user in Turso here if needed
      // For now, Auth.js will handle the session in a JWT/Cookie
      return true;
    },
    async session({ session, token }) {
      // Add user ID to session from token
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
})
