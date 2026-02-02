"use client";

import { useState, useEffect } from "react";
import { AiOutlineArrowUp } from "react-icons/ai";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 left-6 z-40 p-3 bg-[#111113]/90 backdrop-blur-sm border border-white/[0.08] rounded-full text-white/50 hover:text-white hover:border-emerald-500/30 transition-all shadow-lg hover:shadow-emerald-500/10"
      aria-label="Scroll to top"
    >
      <AiOutlineArrowUp className="w-5 h-5" />
    </button>
  );
}
