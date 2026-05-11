import "../globals.css";
import GeneralHeader from "@/component/GeneralHeader.js";
import AuthGuard from "@/component/AuthGuard.js";

export const metadata = {
  title: "Movie Content",
  description: "Enjoy free movies from Africa",
};

export default async function MovieContentLayout({ children }) {
  return (
    <AuthGuard>
      <GeneralHeader />
      {children}
    </AuthGuard>
  );
}
