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
        className={`${inter.className} bg-black text-white min-h-screen flex`}
        suppressHydrationWarning
      >
        {!isLoginOrRegister && <Dashboard />}
        <main
          className={`flex-1 flex flex-col ${
            !isLoginOrRegister ? "ml-64 p-8" : ""
          }`}
        >
          {!isLoginOrRegister && <Header />}
          <div className="flex-1 mt-4">
            {children}
          </div>
          {!isLoginOrRegister && pathname !== "/profile" && <Footer />}
        </main>
      </body>
    </html>
  );
}
