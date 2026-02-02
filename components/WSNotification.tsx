"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AiOutlineClose, AiOutlineBell, AiOutlineSound } from "react-icons/ai";
import { useWebSocket, WSMessage } from "@/lib/useWebSocket";

const stripHtml = (html: string) => {
  return html
    .replace(/<[^>]*>/g, " ")  // Remove HTML tags
    .replace(/&nbsp;/g, " ")   // Replace &nbsp;
    .replace(/&amp;/g, "&")    // Replace &amp;
    .replace(/&lt;/g, "<")     // Replace &lt;
    .replace(/&gt;/g, ">")     // Replace &gt;
    .replace(/&quot;/g, '"')   // Replace &quot;
    .replace(/\s+/g, " ")      // Collapse whitespace
    .trim();
};

interface Notification {
  id: string;
  type: "new_post" | "new_comment";
  title?: string;
  author: string;
  postId?: string;
  timestamp: Date;
}

const STORAGE_KEY = "znap_notifications_enabled";

export function WSNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Load preference from localStorage
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setEnabled(stored === "true");
    }
  }, []);
  
  // Save preference to localStorage
  const toggleNotifications = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    localStorage.setItem(STORAGE_KEY, String(newValue));
    if (!newValue) {
      setNotifications([]); // Clear existing notifications when disabled
    }
  };
  
  const handleMessage = useCallback((msg: WSMessage) => {
    if (!enabled) return;
    
    if (msg.type === "new_post") {
      const data = msg.data as { id: string; title: string; author_username: string };
      const notification: Notification = {
        id: `post-${data.id}-${Date.now()}`,
        type: "new_post",
        title: data.title,
        author: data.author_username,
        postId: data.id,
        timestamp: new Date(),
      };
      setNotifications(prev => [notification, ...prev].slice(0, 5));
    }
    
    if (msg.type === "new_comment") {
      const data = msg.data as { id: string; post_id: string; author_username: string; content: string };
      const cleanContent = stripHtml(data.content);
      const notification: Notification = {
        id: `comment-${data.id}-${Date.now()}`,
        type: "new_comment",
        title: cleanContent.slice(0, 50) + (cleanContent.length > 50 ? "..." : ""),
        author: data.author_username,
        postId: data.post_id,
        timestamp: new Date(),
      };
      setNotifications(prev => [notification, ...prev].slice(0, 5));
    }
  }, [enabled]);
  
  useWebSocket(handleMessage);
  
  // Auto-remove after 5 seconds
  useEffect(() => {
    if (notifications.length === 0) return;
    
    const timer = setTimeout(() => {
      setNotifications(prev => prev.slice(0, -1));
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [notifications]);
  
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  if (!mounted) return null;
  
  return (
    <>
      {/* Toggle Button - Always visible on desktop */}
      <button
        onClick={toggleNotifications}
        className="fixed top-16 right-4 z-50 hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-[#111113]/80 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.15] transition-all group"
        title={enabled ? "Disable notifications" : "Enable notifications"}
      >
        {enabled ? (
          <AiOutlineBell className="w-4 h-4 text-emerald-400" />
        ) : (
          <AiOutlineSound className="w-4 h-4 text-white/30" />
        )}
        <span className={`text-xs font-medium ${enabled ? "text-emerald-400" : "text-white/30"}`}>
          {enabled ? "Live" : "Off"}
        </span>
        <span className={`w-1.5 h-1.5 rounded-full ${enabled ? "bg-emerald-400 animate-pulse" : "bg-white/20"}`} />
      </button>
      
      {/* Notifications */}
      {enabled && notifications.length > 0 && (
        <div className="fixed top-28 right-4 z-50 hidden md:flex flex-col gap-2 max-w-sm">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-[#111113]/95 backdrop-blur-xl border border-white/[0.08] rounded-lg p-4 shadow-2xl animate-slide-in"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      notification.type === "new_post" 
                        ? "bg-emerald-500/20 text-emerald-400" 
                        : "bg-cyan-500/20 text-cyan-400"
                    }`}>
                      {notification.type === "new_post" ? "New Post" : "New Comment"}
                    </span>
                    <span className="text-white/30 text-xs">@{notification.author}</span>
                  </div>
                  
                  {notification.postId ? (
                    <Link 
                      href={`/posts/${notification.postId}`}
                      onClick={() => removeNotification(notification.id)}
                      className="text-sm text-white/80 hover:text-white line-clamp-2 block"
                    >
                      {notification.title ? stripHtml(notification.title) : ""}
                    </Link>
                  ) : (
                    <p className="text-sm text-white/80 line-clamp-2">{notification.title ? stripHtml(notification.title) : ""}</p>
                  )}
                </div>
                
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="text-white/30 hover:text-white/60 p-1"
                >
                  <AiOutlineClose className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
