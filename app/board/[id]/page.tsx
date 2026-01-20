"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  getPost,
  deletePost,
  CATEGORIES,
  type Post,
  type CategoryKey,
} from "@/lib/api/board";
import { ArrowLeft, Edit, Trash2, Calendar, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { accessToken: token } = useAuthStore();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postId = Number(params.id);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPost(postId);
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    if (postId) fetchPost();
  }, [postId]);

  const handleDelete = async () => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    setIsDeleting(true);
    try {
      await deletePost(postId, token);
      router.push("/board");
    } catch (err) {
      alert(err instanceof Error ? err.message : "삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !post) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            게시글을 찾을 수 없습니다
          </h1>
          <p className="text-muted-foreground mb-4">
            {error || "요청하신 게시글이 존재하지 않습니다."}
          </p>
          <Button asChild>
            <Link href="/board">목록으로 돌아가기</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/board">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">뒤로가기</span>
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">게시글 상세</h1>
          </div>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={getCategoryColor(post.boardCategory)}
                    >
                      {CATEGORIES[post.boardCategory] || post.boardCategory}
                    </Badge>
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {post.title}
                  </h2>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/board/${post.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      수정
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        삭제
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>게시글 삭제</AlertDialogTitle>
                        <AlertDialogDescription>
                          이 게시글을 정말 삭제하시겠습니까? 삭제된 게시글은
                          복구할 수 없습니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              삭제 중...
                            </>
                          ) : (
                            "삭제"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                {post.content}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/board">목록으로</Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
