import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "staff" | "customer";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: "admin" | "staff" | "customer";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "staff" | "customer";
  }
}
