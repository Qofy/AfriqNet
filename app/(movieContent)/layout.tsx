import "../globals.css";
import GeneralHeader from "@/component/GeneralHeader";
import WatchlistLoader from "@/component/WatchlistLoader";

export const metadata = {
  title: "Movie Content",
  description: "Enjoy free movies from Africa",
};

export default async function MovieContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GeneralHeader />
      <WatchlistLoader />
      {children}
    </>
  );
}
