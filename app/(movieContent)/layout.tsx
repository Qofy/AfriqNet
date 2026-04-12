import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import GeneralHeader from "@/component/GeneralHeader.js";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movie Content",
  description: "Enjoy free movies from Africa",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body   className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
       <GeneralHeader/> 
        {children}
      </body>
    </html>
  );
}
