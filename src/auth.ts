import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user, account, profile }) {
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
