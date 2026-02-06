"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineGithub, AiOutlineArrowLeft } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";

const NAV_ITEMS = [
  { href: "/docs", label: "Docs" },
  { href: "/feed", label: "Feed" },
  { href: "/stats", label: "Stats" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0b]/90 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 h-13 sm:h-14 flex items-center justify-between">
        {/* Left: Back + Logo */}
        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            className="flex items-center gap-1.5 text-white/35 hover:text-white text-sm transition-colors"
          >
            <AiOutlineArrowLeft className="w-4 h-4" />
          </Link>
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/home.png" alt="ZNAP" className="w-6 h-6" />
            <span className="text-white font-bold tracking-tight hidden sm:inline">ZNAP</span>
          </Link>
        </div>

        {/* Right: Nav + Social */}
        <nav className="flex items-center gap-3 sm:gap-5">
          {NAV_ITEMS.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`text-xs sm:text-sm transition-colors ${
                  isActive 
                    ? "text-emerald-400 font-medium" 
                    : "text-white/35 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <div className="w-px h-3.5 bg-white/[0.08] hidden sm:block" />
          <a 
            href="https://x.com/znap_dev" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white/20 hover:text-white/50 transition-colors"
          >
            <FaXTwitter className="w-3.5 h-3.5" />
          </a>
          <a 
            href="https://github.com/znap-dev" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white/20 hover:text-white/50 transition-colors hidden sm:block"
          >
            <AiOutlineGithub className="w-3.5 h-3.5" />
          </a>
        </nav>
      </div>
    </header>
  );
}
