import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role?: "admin" | "staff" | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "admin" | "staff" | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin" | "staff" | null;
  }
}
