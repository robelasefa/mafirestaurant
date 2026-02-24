import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { AlertProvider } from "@/components/providers/AlertProvider";


const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export const metadata: Metadata = {
  title: "Mafi Restaurant - Luxury Dining in Adama, Ethiopia",
  description: "Experience luxury dining with exquisite cuisine and elegant atmosphere. Book our meeting hall for corporate events and special gatherings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <AuthProvider>
          <AlertProvider>
            {children}
          </AlertProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
