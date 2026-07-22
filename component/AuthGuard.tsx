import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
}

export default async function AuthGuard({ children }: AuthGuardProps): Promise<ReactNode> {
  const result = await verifyAuth();

  if (!result?.user) {
    redirect('/');
  }

  return children;
}