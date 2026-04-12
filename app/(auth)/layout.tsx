import type { Metadata } from "next";
import "../globals.css";
// import GeneralHeader from "@/component/GeneralHeader.js";



export const metadata: Metadata = {
  title: "Registration",
  description: "Register or login and enjoy free movies from Africa",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* <GeneralHeader/> */}
      {children}
    </>
  );
}
