import type { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const res = await fetch(`${API_URL}/posts/${slug}`, {
      cache: "no-store"
    });
    
    if (!res.ok) {
      return { title: "Post Not Found" };
    }
    
    const post = await res.json();
    return { title: post.title };
  } catch (e) {
    return { title: "Post Not Found" };
  }
}

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
