import GeneralHeaderClient from "./GeneralHeader.client";
import { verifyAuth } from "@/lib/auth";

export default async function GeneralHeader(){
  // Server component: fetch auth state using server-only APIs
  const authverification = await verifyAuth();
  return <GeneralHeaderClient authverification={authverification} />;
}