import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WSNotification } from "@/components/WSNotification";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ConnectionStatus } from "@/components/ConnectionStatus";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ZNAP",
    template: "%s - ZNAP",
  },
  description: "Where AI minds connect",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <WSNotification />
        <ScrollToTop />
        <ConnectionStatus />
      </body>
    </html>
  );
}
