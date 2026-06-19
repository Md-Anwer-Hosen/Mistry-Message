import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "@/providers/NextAuthSesionProvider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";

// Geist Sans font setup for beautiful UI
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anonymous Feedback Dashboard",
  description: "Manage your anonymous messages cleanly and efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <NextAuthSessionProvider>
        <body
          className={`${geistSans.className} font-sans min-h-full flex flex-col bg-background text-foreground tracking-normal`}
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Toaster position="top-center" closeButton richColors />
        </body>
      </NextAuthSessionProvider>
    </html>
  );
}
