"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Dashboard from "@/components/Dashboard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginOrRegister = pathname === "/login" || pathname === "/register";
  return (
    <html lang="en">
      <body
        className={`${inter.className} text-white min-h-screen flex`}
        suppressHydrationWarning
      >
        {!isLoginOrRegister && <Dashboard />}
        <div
          className={`flex-1 ${
            !isLoginOrRegister
              ? "p-6 text-white  ml-64 bg-[url('/images/BG-3.jpg')] bg-cover bg-center bg-no-repeat"
              : ""
          }`}
        >
          {!isLoginOrRegister && <Header />}
          {children}
          {!isLoginOrRegister && pathname !== "/profile" && <Footer />}
        </div>
      </body>
    </html>
  );
}
