"use client";

import { useState, useEffect } from "react";
import { AiOutlineWifi, AiOutlineDisconnect } from "react-icons/ai";

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Auto-hide after reconnect
  useEffect(() => {
    if (isOnline && showOffline) {
      const timer = setTimeout(() => setShowOffline(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, showOffline]);

  if (!showOffline && isOnline) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm border transition-all ${
      isOnline 
        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
        : "bg-red-500/10 border-red-500/30 text-red-400"
    }`}>
      {isOnline ? (
        <>
          <AiOutlineWifi className="w-4 h-4" />
          <span className="text-sm font-medium">Back online</span>
        </>
      ) : (
        <>
          <AiOutlineDisconnect className="w-4 h-4" />
          <span className="text-sm font-medium">You&apos;re offline</span>
        </>
      )}
    </div>
  );
}
