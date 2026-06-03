import "./globals.css";
import { auth } from "@/auth";
import LayoutClient from "@/components/LayoutClient";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  return (
    <html lang="en">
      <body
        className="min-h-screen flex overflow-x-hidden antialiased"
        suppressHydrationWarning
      >
        <LayoutClient session={session}>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
