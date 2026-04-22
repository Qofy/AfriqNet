"use client"

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Home, Film, Tv, List, Music, User, Camera } from "lucide-react";
import { logout } from "@/actions/auth-action";

export default function GeneralHeaderClient({ authverification }) {
  const [scrolled, setScrolled] = useState(false);
  const [profileUrl, setProfileUrl] = useState(
    authverification?.user?.profileImage || null
  );
  const inputRef = useRef(null);
  const pathname = usePathname();

  const links = [
    { id: 0, link: "/home", tag: "Home", icon: Home },
    { id: 1, link: "/movies", tag: "Movies", icon: Film },
    { id: 2, link: "/tvShows", tag: "TV Shows", icon: Tv },
    { id: 3, link: "/genres", tag: "Genres", icon: List },
    { id: 4, link: "/musicVideos", tag: "Music", icon: Music },
  ];

  // Check if current path is active
  const isActiveLink = (linkPath) => pathname === linkPath;

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
      {/* Desktop Header - Enhanced */}
      <nav
        className={`flex justify-between items-center p-3 md:p-6 lg:px-8 fixed z-100 w-full transition-all duration-300 ${
          scrolled ? "bg-black/80 backdrop-blur-xl shadow-lg border-b border-white/10" : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/home" className="w-10 h-10 md:w-12 md:h-12 bg-linear-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center relative overflow-hidden shadow-lg hover:shadow-red-500/25 hover:scale-105 transition-all duration-200">
            <Image src="/images/logo.png" alt="logo" fill priority className="object-cover object-center" />
          </Link>
          <span className="hidden lg:block text-white font-bold text-xl">AfriqNet</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-1">
          {links.map((link) => {
            const isActive = isActiveLink(link.link);
            return (
              <Link 
                href={link.link} 
                key={link.id}
                className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  isActive 
                    ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/25' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.tag}
              </Link>
            );
          })}
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
                    <button type="submit" className="w-full text-left px-3 py-2 text-sm text-white rounded bg-[#f23914] hover:bg-[#f55754]">Sign out</button>
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

      {/* Mobile Navigation - Redesigned */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="mx-auto w-full max-w-sm px-1 py-2">
          <div className="flex justify-around items-center">
            {links.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveLink(item.link);
              return (
                <Link 
                  key={item.id}
                  href={item.link} 
                  aria-label={item.tag} 
                  className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 min-w-15 relative group ${
                    isActive 
                      ? 'text-blue-400 bg-blue-400/10 scale-105' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-400 rounded-full"></div>
                  )}
                  
                  {/* Icon with subtle animation */}
                  <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                    <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  
                  {/* Label */}
                  <span className={`text-xs mt-1 font-medium transition-all duration-200 ${
                    isActive 
                      ? 'opacity-100 scale-95 font-semibold' 
                      : 'opacity-70 group-hover:opacity-100'
                  }`}>
                    {item.tag}
                  </span>
                  
                  {/* Haptic-like feedback pulse */}
                  {isActive && (
                    <div className="absolute inset-0 bg-blue-400/20 rounded-xl animate-pulse opacity-30"></div>
                  )}
                </Link>
              );
            })}
            
         
          </div>
        </div>
      </div>
    </>
  );
}
