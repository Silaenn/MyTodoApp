import "./globals.css";
import { auth } from "@/auth";
import LayoutClient from "@/components/LayoutClient";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: {
    default: "TaskTune | Productivity Meets Rhythm",
    template: "%s | TaskTune"
  },
  description: "A neo-brutalist todo application integrated with music discovery. Master your tasks while finding your vibe.",
  keywords: ["TaskTune", "Todo App", "Music Player", "Productivity", "Neo-Brutalism", "Task Management", "YouTube Music"],
  authors: [{ name: "Deo Keldi Silaen" }],
  creator: "Deo Keldi Silaen",
  icons: {
    icon: "/images/logo.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body
        className="min-h-screen flex antialiased bg-brutal-parchment font-sans"
        suppressHydrationWarning
      >
        <LayoutClient session={session}>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}