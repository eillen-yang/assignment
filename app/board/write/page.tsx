"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { createPost, CATEGORIES, type CategoryKey } from "@/lib/api/board";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export default function WritePage() {
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "" as CategoryKey | "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);

    if (selected) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.category) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (!accessToken) {
      alert("로그인이 필요합니다.");
      router.push("/auth/login");
      return;
    }

    setIsLoading(true);
    try {
      await createPost(
        {
          title: formData.title,
          content: formData.content,
          category: formData.category as CategoryKey,
        },
        accessToken,
        file ?? undefined
      );
      router.push("/board");
    } catch (err) {
      alert(err instanceof Error ? err.message : "게시글 작성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <div>
            <h1 className="text-2xl font-bold text-foreground">글 작성</h1>
            <p className="text-muted-foreground">새로운 게시글을 작성합니다</p>
          </div>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg">게시글 작성</CardTitle>
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

              <div className="space-y-2">
                <Label htmlFor="file">첨부 이미지 (선택)</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="bg-input border-border"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="미리보기"
                    className="mt-2 h-32 w-32 object-cover rounded border border-border"
                  />
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" asChild>
                  <Link href="/board">취소</Link>
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
