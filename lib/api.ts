const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Types
export interface User {
  id: string;
  username: string;
  solana_address?: string | null;
  verified: number;
  verify_proof?: string | null;
  created_at: string;
  post_count: number;
  comment_count: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
  author_id?: string;
  author_username: string;
  author_verified?: number;
  comment_count: number;
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  author_username: string;
  author_verified?: number;
  is_op: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// API functions
export async function getPosts(page = 1, limit = 10): Promise<PaginatedResponse<Post>> {
  const res = await fetch(`${API_URL}/posts?page=${page}&limit=${limit}`, {
    cache: "no-store"
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  
  return res.json();
}

export async function getPost(id: string): Promise<Post | null> {
  const res = await fetch(`${API_URL}/posts/${id}`, {
    cache: "no-store"
  });
  
  if (res.status === 404) {
    return null;
  }
  
  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }
  
  return res.json();
}

export async function getComments(
  postId: string, 
  page = 1, 
  limit = 10, 
  sort: "new" | "old" = "new"
): Promise<PaginatedResponse<Comment>> {
  const res = await fetch(
    `${API_URL}/posts/${postId}/comments?page=${page}&limit=${limit}&sort=${sort}`,
    { cache: "no-store" }
  );
  
  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }
  
  return res.json();
}

export async function getUser(username: string): Promise<User | null> {
  const res = await fetch(`${API_URL}/users/${username}`, {
    cache: "no-store"
  });
  
  if (res.status === 404) {
    return null;
  }
  
  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }
  
  return res.json();
}

export interface Activity {
  type: "post" | "comment";
  id: string;
  title: string | null;
  content: string | null;
  created_at: string;
  post_id: string | null;
  post_title: string | null;
}

export async function getUserActivity(
  username: string, 
  page = 1, 
  limit = 10
): Promise<PaginatedResponse<Activity>> {
  const res = await fetch(
    `${API_URL}/users/${username}/activity?page=${page}&limit=${limit}`,
    { cache: "no-store" }
  );
  
  if (!res.ok) {
    return { items: [], total: 0, page: 1, limit, total_pages: 0 };
  }
  
  return res.json();
}

export async function getUserPosts(
  username: string, 
  page = 1, 
  limit = 10
): Promise<PaginatedResponse<Post>> {
  const res = await fetch(
    `${API_URL}/users/${username}/posts?page=${page}&limit=${limit}`,
    { cache: "no-store" }
  );
  
  if (!res.ok) {
    return { items: [], total: 0, page: 1, limit, total_pages: 0 };
  }
  
  return res.json();
}

export interface UserComment {
  id: string;
  content: string;
  created_at: string;
  post_id: string;
  post_title: string;
}

export async function getUserComments(
  username: string, 
  page = 1, 
  limit = 10
): Promise<PaginatedResponse<UserComment>> {
  const res = await fetch(
    `${API_URL}/users/${username}/comments?page=${page}&limit=${limit}`,
    { cache: "no-store" }
  );
  
  if (!res.ok) {
    return { items: [], total: 0, page: 1, limit, total_pages: 0 };
  }
  
  return res.json();
}

// Time ago helper
export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
  
  // Over 30 days - show date in US format (Jan 15, 2024)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
  });
}
