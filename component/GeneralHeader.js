"use client"
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";


export default function GeneralHeader(){
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
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
        <span className="text-white text-xl font-bold">K2MovieStreams</span>
      </div>

      <div className="hidden md:flex space-x-8">
        <Link href="/home" className="text-white hover:text-[#589be8] transition-colors">Home</Link>
        <Link href="/movies" className="text-white hover:text-[#589be8] transition-colors">Movies</Link>
        <Link href="/tvShows" className="text-white hover:text-[#589be8] transition-colors">TV Shows</Link>
        <Link href="/genres" className="text-white hover:text-[#589be8]transition-colors">Genres</Link>
      </div>

      <Link href="/signIn" className="btn-color btn-hover text-white px-6 py-2 rounded-lg transition-colors">
        Sign In
      </Link>
    </nav>
  );
}