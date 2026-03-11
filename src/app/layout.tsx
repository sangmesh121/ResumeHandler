import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalNotificationSystem } from "@/components/GlobalNotificationSystem";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Resume & Hiring Intelligence | ProHire",
  description: "Scale your career with AI-optimized resumes and real-time hiring intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased bg-background text-foreground`}>
        <GlobalNotificationSystem />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
