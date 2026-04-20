"use client"

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Home, Film, Tv, List, Music, User, Camera } from "lucide-react";
import { logout } from "@/actions/auth-action";

export default function GeneralHeaderClient({ authverification }) {
  const [scrolled, setScrolled] = useState(false);
  const [profileUrl, setProfileUrl] = useState(
    authverification?.user?.profileImage || null
  );
  const inputRef = useRef(null);

  const links = [
    { id: 0, link: "/home", tag: "Home" },
    { id: 1, link: "/movies", tag: "Movies" },
    { id: 2, link: "/tvShows", tag: "Tv Shows" },
    { id: 3, link: "/genres", tag: "Genres" },
    { id: 4, link: "/musicVideos", tag: "Music Videos" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/upload/profile", { method: "POST", body: fd });
      const json = await res.json();
      if (res.ok && json.url) {
        setProfileUrl(json.url);
        // persist to user record so it survives logout/login
        try {
          await fetch('/api/user/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profileUrl: json.url })
          });
        } catch (err) {
          console.error('Failed to persist profile image', err);
        }
      } else {
        console.error("Upload failed", json);
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload error");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <>
      <nav
        className={`flex justify-between items-center p-3 md:p-6 lg:px-8 fixed z-100 w-full transition-colors duration-300 ${
          scrolled ? "bg-black/70 backdrop-blur-md shadow-md" : "bg-transparent"
        }`}
      >
        <div className="flex items-center space-x-2">
          <Link href="/home" className="w-10 h-10 md:w-12 md:h-12 bg-red-600 rounded-lg flex items-center justify-center relative overflow-hidden">
            <Image src="/images/logo.png" alt="logo" fill priority className="object-cover object-center" />
          </Link>
        </div>

        <div className="hidden md:flex space-x-8">
          {links.map((link) => (
            <Link href={link.link} key={link.id}>
              {link.tag}
            </Link>
          ))}
        </div>

        {authverification?.user ? (
          <div className="relative inline-block group cursor-pointer">
              <div className="relative h-10 w-10 md:h-12 md:w-12 flex items-center bg-[#006eeb] justify-center rounded-full overflow-visible">
                {profileUrl ? <Image src={profileUrl} alt="profile" fill className="object-cover rounded-full" /> : <User />}

              <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />

              <button
                type="button"
                onClick={() => {
                  inputRef.current?.click();
                }}
                title="Upload profile image"
                className="absolute right-[3] -bottom-1 bg-white/10 p-1 rounded-full hover:bg-white/20 cursor-pointer"
              >
                <Camera size={14} />
              </button>
            </div>

            <div className="hidden absolute right-0 top-full  z-20 group-hover:block group-focus-within:block">
              <div className="transform opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100 transition-all duration-150 origin-top-right bg-black/80 text-white rounded-md shadow-[0_8px_24px_rgba(0,0,0,0.25)] min-w-45 py-2 px-1">
                <Link href={"/manageProfile"} className="block px-3 py-2 text-sm text-white hover:bg-white/5 rounded">Manage profile</Link>
                <Link href={"/account"} className="block px-3 py-2 text-sm text-white hover:bg-white/5 rounded">Account</Link>
                <Link href={"/help"} className="block px-3 py-2 text-sm text-white hover:bg-white/5 rounded">Help</Link>
                <div className="border-t border-white/10 mt-1 pt-2 px-1">
                  <form action={logout}>
                    <button type="submit" className="w-full text-left px-3 py-2 text-sm text-white rounded bg-[#006eeb] hover:bg-[#0a63d6]">Sign out</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Link className="btn-color btn-hover text-white px-6 py-2 rounded-lg transition-colors" href="/login">
            Sign in
          </Link>
        )}
      </nav>

      <div className="md:hidden fixed inset-x-3 bottom-3 z-50 bg-black/80 backdrop-blur-md border-t border-white/10 rounded-2xl h-10" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="mx-auto w-full max-w-3xl px-4 py-2 flex justify-between items-center">
          <Link href="/home" aria-label="Home" className="flex flex-col items-center text-white text-xs">
            <Home size={20} />
          </Link>

          <Link href="/movies" aria-label="Movies" className="flex flex-col items-center text-white text-xs px-2">
            <Film size={20} />
          </Link>

          <Link href="/tvShows" aria-label="TV Shows" className="flex flex-col items-center text-white text-xs px-2">
            <Tv size={20} />
          </Link>

          <Link href="/genres" aria-label="Genres" className="flex flex-col items-center text-white text-xs px-2">
            <List size={20} />
          </Link>

          <Link href="/musicVideos" aria-label="Music Videos" className="flex flex-col items-center text-white text-xs px-2">
            <Music size={20} />
          </Link>

          {/* <Link href="/login" aria-label="Sign In" className="flex flex-col items-center text-white text-xs">
            <User size={20} />
          </Link> */}
        </div>
      </div>
    </>
  );
}
