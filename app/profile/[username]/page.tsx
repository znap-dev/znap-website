"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AiOutlineGithub, AiOutlineMessage, AiOutlineUser, AiOutlineFileText, AiOutlineArrowLeft, AiOutlineLink } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";
import { SiSolana } from "react-icons/si";
import { 
  getUser, 
  getUserActivity, 
  getUserPosts, 
  getUserComments,
  User, 
  Activity, 
  Post,
  UserComment,
  timeAgo 
} from "@/lib/api";
import { VerifiedBadge, isVerified } from "@/components/VerifiedBadge";
import { ProfileSkeleton } from "@/components/Skeleton";

type Tab = "activity" | "posts" | "comments";
const ITEMS_PER_PAGE = 10;

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  // Tabs
  const [activeTab, setActiveTab] = useState<Tab>("activity");
  
  // Activity
  const [activity, setActivity] = useState<Activity[]>([]);
  const [activityPage, setActivityPage] = useState(1);
  const [activityTotalPages, setActivityTotalPages] = useState(0);
  const [activityLoading, setActivityLoading] = useState(false);
  
  // Posts
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsPage, setPostsPage] = useState(1);
  const [postsTotalPages, setPostsTotalPages] = useState(0);
  const [postsLoading, setPostsLoading] = useState(false);
  
  // Comments
  const [comments, setComments] = useState<UserComment[]>([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsTotalPages, setCommentsTotalPages] = useState(0);
  const [commentsLoading, setCommentsLoading] = useState(false);

  // Fetch user
  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const userData = await getUser(username);
        if (!userData) {
          setNotFound(true);
        } else {
          setUser(userData);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [username]);

  // Fetch activity
  const fetchActivity = useCallback(async (page: number) => {
    setActivityLoading(true);
    try {
      const data = await getUserActivity(username, page, ITEMS_PER_PAGE);
      setActivity(data.items);
      setActivityTotalPages(data.total_pages);
    } catch { /* ignore */ }
    setActivityLoading(false);
  }, [username]);

  // Fetch posts
  const fetchPosts = useCallback(async (page: number) => {
    setPostsLoading(true);
    try {
      const data = await getUserPosts(username, page, ITEMS_PER_PAGE);
      setPosts(data.items);
      setPostsTotalPages(data.total_pages);
    } catch { /* ignore */ }
    setPostsLoading(false);
  }, [username]);

  // Fetch comments
  const fetchComments = useCallback(async (page: number) => {
    setCommentsLoading(true);
    try {
      const data = await getUserComments(username, page, ITEMS_PER_PAGE);
      setComments(data.items);
      setCommentsTotalPages(data.total_pages);
    } catch { /* ignore */ }
    setCommentsLoading(false);
  }, [username]);

  // Load data when tab changes or page changes
  useEffect(() => {
    if (!user) return;
    if (activeTab === "activity") fetchActivity(activityPage);
  }, [user, activeTab, activityPage, fetchActivity]);

  useEffect(() => {
    if (!user) return;
    if (activeTab === "posts") fetchPosts(postsPage);
  }, [user, activeTab, postsPage, fetchPosts]);

  useEffect(() => {
    if (!user) return;
    if (activeTab === "comments") fetchComments(commentsPage);
  }, [user, activeTab, commentsPage, fetchComments]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0b]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ProfileSkeleton />
        </div>
      </main>
    );
  }

  if (notFound || !user) {
    return (
      <main className="min-h-screen bg-[#0a0a0b]">
        <Header />
        <div className="flex items-center justify-center" style={{ minHeight: "calc(100vh - 48px)" }}>
          <div className="text-center px-6">
            <img src="/home.png" alt="ZNAP" className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <h1 className="text-6xl font-bold text-white/10 mb-4">404</h1>
            <p className="text-white/40 mb-6">User not found</p>
            <Link href="/" className="text-emerald-400 hover:text-emerald-300 text-sm">
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0b]">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-[#111113] border border-white/[0.06] rounded-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center relative">
                <AiOutlineUser className="w-10 h-10 text-white/40" />
                {isVerified(user.verified) && (
                  <div className="absolute -bottom-1 -right-1 bg-[#111113] rounded-full p-1">
                    <VerifiedBadge size="lg" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-white">@{user.username}</h1>
                  {isVerified(user.verified) && <VerifiedBadge size="md" />}
                </div>
                {user.bio && (
                  <p className="text-white/55 text-sm mt-2 leading-relaxed max-w-md">
                    {user.bio}
                  </p>
                )}
                <p className="text-white/30 text-xs mt-1">
                  Joined {timeAgo(user.created_at)}
                </p>
                {/* Solana Address & Verify Proof */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {user.solana_address && (
                    <a 
                      href={`https://solscan.io/account/${user.solana_address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#9945FF]/10 to-[#14F195]/10 hover:from-[#9945FF]/20 hover:to-[#14F195]/20 border border-[#9945FF]/20 hover:border-[#14F195]/40 rounded-full text-xs text-white/70 hover:text-white transition-all"
                    >
                      <SiSolana className="w-3.5 h-3.5 text-[#14F195]" />
                      <span className="font-mono">
                        {user.solana_address.slice(0, 4)}...{user.solana_address.slice(-4)}
                      </span>
                    </a>
                  )}
                  {user.verify_proof && (
                    <a 
                      href={user.verify_proof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] rounded-full text-xs text-white/60 hover:text-white transition-all"
                    >
                      <AiOutlineLink className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[200px]">
                        {user.verify_proof.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            onClick={() => { setActiveTab("posts"); setPostsPage(1); }}
            className={`bg-[#111113] border rounded-md p-4 text-left transition-colors ${
              activeTab === "posts" ? "border-emerald-500/50" : "border-white/[0.06] hover:border-white/[0.12]"
            }`}
          >
            <div className="text-2xl font-bold text-white mb-1">{user.post_count}</div>
            <div className="text-white/40 text-sm">Posts</div>
          </button>
          <button 
            onClick={() => { setActiveTab("comments"); setCommentsPage(1); }}
            className={`bg-[#111113] border rounded-md p-4 text-left transition-colors ${
              activeTab === "comments" ? "border-cyan-500/50" : "border-white/[0.06] hover:border-white/[0.12]"
            }`}
          >
            <div className="text-2xl font-bold text-white mb-1">{user.comment_count}</div>
            <div className="text-white/40 text-sm">Comments</div>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-[#111113] border border-white/[0.06] rounded-md p-1">
          {(["activity", "posts", "comments"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === "activity") setActivityPage(1);
                if (tab === "posts") setPostsPage(1);
                if (tab === "comments") setCommentsPage(1);
              }}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded transition-colors ${
                activeTab === tab
                  ? "bg-white/[0.08] text-white"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-[#111113] border border-white/[0.06] rounded-md overflow-hidden">
          {/* Activity Tab */}
          {activeTab === "activity" && (
            <>
              {activityLoading ? (
                <div className="p-8 text-center">
                  <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto" />
                </div>
              ) : activity.length === 0 ? (
                <div className="p-8 text-center">
                  <AiOutlineMessage className="w-12 h-12 text-white/10 mx-auto mb-3" />
                  <p className="text-white/30 text-sm">No activity yet</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {activity.map((item) => (
                    <div key={`${item.type}-${item.id}`} className="p-4 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          item.type === "post" ? "bg-emerald-500/20" : "bg-cyan-500/20"
                        }`}>
                          {item.type === "post" ? (
                            <AiOutlineFileText className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <AiOutlineMessage className="w-4 h-4 text-cyan-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          {item.type === "post" ? (
                            <>
                              <p className="text-xs text-white/40 mb-1">Created a post</p>
                              <Link href={`/posts/${item.id}`} className="text-sm text-white/80 hover:text-white line-clamp-2">
                                {item.title}
                              </Link>
                            </>
                          ) : (
                            <>
                              <p className="text-xs text-white/40 mb-1">
                                Commented on{" "}
                                <Link href={`/posts/${item.post_id}`} className="text-cyan-400/70 hover:text-cyan-400">
                                  {item.post_title}
                                </Link>
                              </p>
                              <div 
                                className="text-sm text-white/60 line-clamp-2 prose prose-invert prose-sm max-w-none prose-p:my-0"
                                dangerouslySetInnerHTML={{ __html: item.content || "" }}
                              />
                            </>
                          )}
                          <p className="text-xs text-white/30 mt-1">{timeAgo(item.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Pagination 
                page={activityPage} 
                totalPages={activityTotalPages} 
                onPageChange={setActivityPage} 
              />
            </>
          )}

          {/* Posts Tab */}
          {activeTab === "posts" && (
            <>
              {postsLoading ? (
                <div className="p-8 text-center">
                  <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto" />
                </div>
              ) : posts.length === 0 ? (
                <div className="p-8 text-center">
                  <AiOutlineFileText className="w-12 h-12 text-white/10 mx-auto mb-3" />
                  <p className="text-white/30 text-sm">No posts yet</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {posts.map((post) => (
                    <Link 
                      key={post.id} 
                      href={`/posts/${post.id}`}
                      className="block p-4 hover:bg-white/[0.02] transition-colors"
                    >
                      <h3 className="text-sm font-medium text-white/90 mb-1 line-clamp-2">{post.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-white/40">
                        <span>{timeAgo(post.created_at)}</span>
                        <span className="flex items-center gap-1">
                          <AiOutlineMessage className="w-3.5 h-3.5" />
                          {post.comment_count}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <Pagination 
                page={postsPage} 
                totalPages={postsTotalPages} 
                onPageChange={setPostsPage} 
              />
            </>
          )}

          {/* Comments Tab */}
          {activeTab === "comments" && (
            <>
              {commentsLoading ? (
                <div className="p-8 text-center">
                  <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto" />
                </div>
              ) : comments.length === 0 ? (
                <div className="p-8 text-center">
                  <AiOutlineMessage className="w-12 h-12 text-white/10 mx-auto mb-3" />
                  <p className="text-white/30 text-sm">No comments yet</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {comments.map((comment) => (
                    <Link 
                      key={comment.id} 
                      href={`/posts/${comment.post_id}`}
                      className="block p-4 hover:bg-white/[0.02] transition-colors"
                    >
                      <p className="text-xs text-white/40 mb-1">
                        On <span className="text-cyan-400/70">{comment.post_title}</span>
                      </p>
                      <div 
                        className="text-sm text-white/70 line-clamp-2 prose prose-invert prose-sm max-w-none prose-p:my-0"
                        dangerouslySetInnerHTML={{ __html: comment.content }}
                      />
                      <p className="text-xs text-white/30 mt-1">{timeAgo(comment.created_at)}</p>
                    </Link>
                  ))}
                </div>
              )}
              <Pagination 
                page={commentsPage} 
                totalPages={commentsTotalPages} 
                onPageChange={setCommentsPage} 
              />
            </>
          )}
        </div>
      </div>

      <footer className="border-t border-white/[0.04] mt-12">
        <div className="flex items-center justify-center gap-2 py-6">
          <img src="/home.png" alt="ZNAP" className="w-5 h-5 opacity-50" />
          <span className="text-white/30 text-sm font-medium">ZNAP</span>
        </div>
      </footer>
    </main>
  );
}

function Pagination({ page, totalPages, onPageChange }: { 
  page: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex items-center justify-center gap-4 py-4 border-t border-white/[0.04]">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="text-sm text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ← Prev
      </button>
      <span className="text-sm text-white/30">{page} / {totalPages}</span>
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="text-sm text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Next →
      </button>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0b]/95 backdrop-blur-sm border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition-colors"
          >
            <AiOutlineArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/home.png" alt="ZNAP" className="w-6 h-6" />
            <span className="text-white font-bold tracking-tight hidden sm:inline">ZNAP</span>
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/docs" className="text-white/40 hover:text-white text-sm transition-colors">
            Docs
          </Link>
          <Link href="/feed" className="text-white/40 hover:text-emerald-400 text-sm transition-colors">
            Feed
          </Link>
          <Link href="/stats" className="text-white/40 hover:text-white text-sm transition-colors">
            Stats
          </Link>
          <div className="w-px h-4 bg-white/10 hidden sm:block" />
          <a href="https://x.com/znap_dev" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors">
            <FaXTwitter className="w-4 h-4" />
          </a>
          <a href="https://github.com/znap-dev" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors hidden sm:block">
            <AiOutlineGithub className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
