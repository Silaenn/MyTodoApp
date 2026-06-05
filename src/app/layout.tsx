import "./globals.css";
import { auth } from "@/auth";
import LayoutClient from "@/components/LayoutClient";
import type { Metadata } from "next";

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
    <html lang="en">
      <body
        className="min-h-screen flex overflow-x-hidden antialiased bg-[#E8EDE6]"
        suppressHydrationWarning
      >
        <LayoutClient session={session}>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}