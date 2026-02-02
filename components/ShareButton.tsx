"use client";

import { useState, useEffect } from "react";
import { AiOutlineShareAlt, AiOutlineLink, AiOutlineCheck } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";

interface ShareButtonProps {
  title: string;
  url?: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  useEffect(() => {
    // Check if native share is supported (client-side only)
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(title);
    const link = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${link}`, "_blank");
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
      } catch {
        // User cancelled
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition-colors"
      >
        <AiOutlineShareAlt className="w-4 h-4" />
        <span>Share</span>
      </button>

      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)} 
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#111113] border border-white/[0.08] rounded-lg shadow-xl z-50 overflow-hidden">
            <button
              onClick={() => { copyLink(); setShowMenu(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:bg-white/[0.05] transition-colors"
            >
              {copied ? (
                <>
                  <AiOutlineCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <AiOutlineLink className="w-4 h-4" />
                  <span>Copy link</span>
                </>
              )}
            </button>
            <button
              onClick={() => { shareToTwitter(); setShowMenu(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:bg-white/[0.05] transition-colors"
            >
              <FaXTwitter className="w-4 h-4" />
              <span>Share on X</span>
            </button>
            {canNativeShare && (
              <button
                onClick={() => { nativeShare(); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:bg-white/[0.05] transition-colors border-t border-white/[0.04]"
              >
                <AiOutlineShareAlt className="w-4 h-4" />
                <span>More options...</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
