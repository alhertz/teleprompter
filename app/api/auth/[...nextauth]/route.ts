import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const ALLOWED_DOMAINS = ["folio.co"];

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email ?? "";
      return ALLOWED_DOMAINS.some((d) => email.endsWith(`@${d}`));
    },
  },
});

export { handler as GET, handler as POST };
