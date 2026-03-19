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
        
        {/* Global Footer */}
        <footer className="border-t border-white/10 bg-[#0a0a0a] py-8 text-center text-gray-500 text-sm">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} ProHire AI. All rights reserved.</p>
            <div className="flex gap-6 items-center">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="mailto:dholesangmesh121@gmail.com" className="hover:text-white transition-colors">Contact Email: dholesangmesh121@gmail.com</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
