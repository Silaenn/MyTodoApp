import { Inter } from "next/font/google";
import "./globals.css";
import Dashboard from "@/components/Dashboard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { auth } from "@/auth";
import LayoutClient from "@/components/LayoutClient";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-black text-white min-h-screen flex overflow-x-hidden`}
        suppressHydrationWarning
      >
        <LayoutClient session={session}>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
