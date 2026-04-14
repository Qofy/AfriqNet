import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthGuard({ children }) {
  const result = await verifyAuth();
  
//   console.log("AuthGuard - Auth result:", result);
  
  if (!result?.user) {
    // console.log("AuthGuard - No user found, redirecting to /");
    redirect('/');
  }
  
//   console.log("AuthGuard - User authenticated:", result.user);
  return children;
}