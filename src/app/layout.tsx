"use client";

import { Inter, Poppins, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Dashboard from "@/components/Dashboard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["600", "800"] });
const robotoMono = Roboto_Mono({ subsets: ["latin"] });

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
        className={`${inter.className} ${poppins.className} ${robotoMono.className} text-white min-h-screen flex`}
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
          {!isLoginOrRegister && <Footer />}
        </div>
      </body>
    </html>
  );
}
