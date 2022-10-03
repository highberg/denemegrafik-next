import bcrypt from "bcrypt";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        citizenId: {
          label: "TC Kimlik Numarası",
          type: "number",
          placeholder: "12345678901",
        },
        password: {
          label: "Parola",
          type: "password",
          placeholder: "sifre_123",
        },
      },
      async authorize(credentials, req) {
        if (!credentials?.citizenId || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { citizenId: credentials.citizenId },
          include: { student: { include: { class: true } } },
        });
        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.hash);
        if (!isValid) return null;

        return user;
      },
    }),
  ],
};

export default NextAuth(authOptions);
