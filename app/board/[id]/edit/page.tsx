"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getPost,
  updatePost,
  CATEGORIES,
  type CategoryKey,
} from "@/lib/api/board";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const { accessToken: token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "" as CategoryKey | "",
  });

  const postId = Number(params.id);

  useEffect(() => {
    const fetchPost = async () => {
      setIsFetching(true);
      setError(null);
      try {
        const post = await getPost(postId);
        setFormData({
          title: post.title,
          content: post.content,
          category: post.category,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      } finally {
        setIsFetching(false);
      }
    };
    if (postId) fetchPost();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.category) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (!token) {
      alert("로그인이 필요합니다.");
      router.push("/auth/login");
      return;
    }

    setIsLoading(true);
    try {
      await updatePost(
        postId,
        {
          title: formData.title,
          content: formData.content,
          category: formData.category as CategoryKey,
        },
        token
      );
      router.push(`/board/${postId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "게시글 수정에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            게시글을 찾을 수 없습니다
          </h1>
          <p className="text-muted-foreground mb-4">{error}</p>
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
            <Link href={`/board/${postId}`}>
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">뒤로가기</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">글 수정</h1>
            <p className="text-muted-foreground">게시글을 수정합니다</p>
          </div>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg">게시글 수정</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">제목</Label>
                  <Input
                    id="title"
                    placeholder="게시글 제목을 입력하세요"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">카테고리</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        category: value as CategoryKey,
                      })
                    }
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORIES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">내용</Label>
                <Textarea
                  id="content"
                  placeholder="게시글 내용을 입력하세요"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="min-h-75 bg-input border-border resize-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" asChild>
                  <Link href={`/board/${postId}`}>취소</Link>
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      저장
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
