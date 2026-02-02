"use client";

// Base skeleton with pulse animation
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div 
      className={`animate-pulse bg-white/[0.06] rounded ${className}`}
    />
  );
}

// Post card skeleton for homepage
export function PostSkeleton() {
  return (
    <div className="p-5 -mx-3">
      {/* Meta */}
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="h-7 w-28 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
      
      {/* Title */}
      <Skeleton className="h-6 w-3/4 mb-3" />
      
      {/* Content */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      
      {/* Comments */}
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

// Multiple post skeletons
export function PostListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <PostSkeleton />
          {i < count - 1 && (
            <div className="mx-2 border-b border-white/[0.03]" />
          )}
        </div>
      ))}
    </div>
  );
}

// Post detail skeleton
export function PostDetailSkeleton() {
  return (
    <div className="bg-[#111113] border border-white/[0.06] rounded-md overflow-hidden">
      <div className="p-4 sm:p-5">
        {/* Meta */}
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-12" />
        </div>
        
        {/* Title */}
        <Skeleton className="h-8 w-3/4 mb-4" />
        
        {/* Content */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <div className="py-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-4 mt-6 pt-3 border-t border-white/[0.06]">
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

// Comment skeleton
export function CommentSkeleton() {
  return (
    <div className="p-4">
      {/* Meta */}
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-12" />
      </div>
      
      {/* Content */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}

// Comment list skeleton
export function CommentListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="bg-[#111113] border border-white/[0.06] rounded-md overflow-hidden divide-y divide-white/[0.04]">
      {Array.from({ length: count }).map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </div>
  );
}

// Profile skeleton
export function ProfileSkeleton() {
  return (
    <>
      {/* Profile Header */}
      <div className="bg-[#111113] border border-white/[0.06] rounded-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-7 w-40 mb-2" />
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#111113] border border-white/[0.06] rounded-md p-4">
          <Skeleton className="h-8 w-12 mb-1" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="bg-[#111113] border border-white/[0.06] rounded-md p-4">
          <Skeleton className="h-8 w-12 mb-1" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* Activity */}
      <div className="bg-[#111113] border border-white/[0.06] rounded-md overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.06]">
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="p-8">
          <Skeleton className="w-12 h-12 rounded-full mx-auto mb-3" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    </>
  );
}

// Sidebar post skeleton
export function SidebarPostSkeleton() {
  return (
    <div className="px-4 py-3">
      <Skeleton className="h-4 w-full mb-2" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

// Sidebar skeleton
export function SidebarSkeleton() {
  return (
    <div className="bg-[#111113] border border-white/[0.06] rounded-md overflow-hidden">
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="divide-y divide-white/[0.04]">
        {Array.from({ length: 5 }).map((_, i) => (
          <SidebarPostSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
