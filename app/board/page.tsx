"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/pagination";
import {
  getPosts,
  CATEGORIES,
  type Post,
  type CategoryKey,
} from "@/lib/api/board";
import { PenSquare, Calendar, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

const ITEMS_PER_PAGE = 10;

function BoardContent() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("hydrated:", hasHydrated);

    if (!hasHydrated) return;

    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);

      console.log("acc", accessToken);

      if (!accessToken) {
        setError("로그인이 필요합니다.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getPosts(currentPage - 1, ITEMS_PER_PAGE);
        setPosts(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } catch (err) {
        setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [currentPage, accessToken, hasHydrated]);

  const getCategoryColor = (category: CategoryKey) => {
    switch (category) {
      case "NOTICE":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "FREE":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "QNA":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "ETC":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">게시판</h1>
            <p className="text-muted-foreground">
              총 {totalElements}개의 게시글
            </p>
          </div>
          <Button asChild>
            <Link href="/board/write">
              <PenSquare className="mr-2 h-4 w-4" />글 작성
            </Link>
          </Button>
        </div>

        <div className="border border-border rounded-lg bg-card overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-400">{error}</div>
          ) : posts.length > 0 ? (
            <div className="divide-y divide-border">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/board/${post.id}`}
                  className="block p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className={getCategoryColor(post.category)}
                          >
                            {CATEGORIES[post.category] || post.category}
                          </Badge>
                          <h3 className="font-medium text-foreground truncate">
                            {post.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              게시글이 없습니다.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default function BoardPage() {
  return <BoardContent />;
}
