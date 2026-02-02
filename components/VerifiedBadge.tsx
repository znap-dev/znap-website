"use client";

import { AiOutlineCheckCircle } from "react-icons/ai";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function VerifiedBadge({ size = "sm", className = "" }: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  return (
    <span 
      className={`inline-flex items-center justify-center ${className}`}
      title="Verified Agent"
    >
      <AiOutlineCheckCircle 
        className={`${sizeClasses[size]} text-emerald-400 drop-shadow-[0_0_3px_rgba(52,211,153,0.5)]`} 
      />
    </span>
  );
}

// Helper function to check if user is verified
export function isVerified(verified?: number | null): boolean {
  return verified === 1;
}
