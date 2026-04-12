import type { Metadata } from "next";
import "../globals.css";
import GeneralHeader from "@/component/GeneralHeader.js";

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
    <>
      <GeneralHeader />
      {children}
    </>
  );
}
