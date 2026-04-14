"use client"
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Home, Film, Tv, List, Music, User } from "lucide-react";
import { logout } from "@/actions/auth-action"

export default function GeneralHeaderClient({ authverification }){
  const [scrolled, setScrolled] = useState(false);
  const links = [
    {id:0 ,link: "/home", tag:"Home"},
    {id:1 ,link:"/movies", tag:"Movies"},
    {id:2 ,link:"/tvShows", tag:"Tv Shows"},
    {id:3 ,link:"/genres", tag:"Genres"},
    {id:4 ,link:"/musicVideos", tag:"Music Videos"}
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`flex justify-between items-center p-6 lg:px-8 fixed z-100 w-full transition-colors duration-300 ${scrolled ? 'bg-black/70 backdrop-blur-md shadow-md' : 'bg-transparent'}`}
      >
        <div className="flex items-center space-x-2">
          <Link href="/" className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center relative overflow-hidden">
            <Image
              src="/images/logo.png"
              alt="logo"
              fill
              priority
              className="object-cover object-center"
            />
          </Link>
        </div>

        <div className="hidden md:flex space-x-8">
          {links.map(link=>(
            <Link href={link.link} key={link.id}>{link.tag}</Link>
          ))}
        </div>

          {authverification?.user ? (
            <form action={logout}>
              <button type="submit" className="btn-color btn-hover text-white px-6 py-2 rounded-lg transition-colors">Log out</button>
            </form>
          ) : (
            <Link className="btn-color btn-hover text-white px-6 py-2 rounded-lg transition-colors" href="/login">Sign in</Link>
          )}
      </nav>

      {/* Mobile bottom icon nav */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-t border-white/10 rounded-2xl h-12"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="max-w-3xl mx-auto px-10 py-2 flex justify-between items-center">
          <Link href="/home" aria-label="Home" className="flex flex-col items-center text-white text-xs">
            <Home size={20} />
          </Link>

          <Link href="/movies" aria-label="Movies" className="flex flex-col items-center text-white text-xs">
            <Film size={20} />
          </Link>

          <Link href="/tvShows" aria-label="TV Shows" className="flex flex-col items-center text-white text-xs">
            <Tv size={20} />
          </Link>

          <Link href="/genres" aria-label="Genres" className="flex flex-col items-center text-white text-xs">
            <List size={20} />
          </Link>

          <Link href="/musicVideos" aria-label="Music Videos" className="flex flex-col items-center text-white text-xs">
            <Music size={20} />
          </Link>

          <Link href="/login" aria-label="Sign In" className="flex flex-col items-center text-white text-xs">
            <User size={20} />
          </Link>
        </div>
      </div>
    </>
  );
}
