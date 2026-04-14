import type { Metadata } from "next";
import "../globals.css";
import GeneralHeader from "@/component/GeneralHeader.js";
import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Movie Content",
  description: "Enjoy free movies from Africa",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const result = await verifyAuth()
  if(!result?.user){
    return redirect('/')
  }
  return (
    <>
      <GeneralHeader />
      {children}
    </>
  );
}
