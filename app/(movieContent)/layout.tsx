import type { Metadata } from "next";
import "../globals.css";
import GeneralHeader from "@/component/GeneralHeader.js";
import AuthGuard from "@/component/AuthGuard.js";

export const metadata: Metadata = {
  title: "Movie Content",
  description: "Enjoy free movies from Africa",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <GeneralHeader />
      {children}
    </AuthGuard>
  );
}
