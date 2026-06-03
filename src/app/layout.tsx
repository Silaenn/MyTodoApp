import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import LayoutClient from "@/components/LayoutClient";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  return (
    <html lang="en">
      <body
        className={`${jakarta.className} bg-slate-950 text-slate-50 min-h-screen flex overflow-x-hidden antialiased`}
        suppressHydrationWarning
      >
        <LayoutClient session={session}>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
