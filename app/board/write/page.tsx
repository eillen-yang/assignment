"use client";

import type React from "react";
import { useState, useMemo } from "react";
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

const TITLE_MIN = 5;
const TITLE_MAX = 30;
const CONTENT_MIN = 20;
const CONTENT_MAX = 250;

export default function WritePage() {
  const router = useRouter();
  const { accessToken } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "" as CategoryKey,
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

  const isTitleValid =
    formData.title.length >= TITLE_MIN && formData.title.length <= TITLE_MAX;

  const isContentValid =
    formData.content.length >= CONTENT_MIN &&
    formData.content.length <= CONTENT_MAX;

  const isFormValid = useMemo(() => {
    return isTitleValid && isContentValid && Boolean(formData.category);
  }, [isTitleValid, isContentValid, formData.category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      alert("입력 조건을 다시 확인해주세요.");
      return;
    }

    if (!accessToken) {
      alert("로그인이 필요합니다.");
      router.push("/auth/login");
      return;
    }

    try {
      setIsLoading(true);

      await createPost(
        {
          title: formData.title,
          content: formData.content,
          category: formData.category,
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
        {/* 헤더 */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/board">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">글 작성</h1>
            <p className="text-muted-foreground">새로운 게시글을 작성합니다</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>게시글 작성</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* 제목 */}
                <div className="space-y-2">
                  <Label>제목</Label>
                  <Input
                    value={formData.title}
                    maxLength={TITLE_MAX}
                    placeholder="게시글 제목을 입력하세요"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value.slice(0, TITLE_MAX),
                      })
                    }
                  />
                  <p
                    className={`text-sm text-right ${
                      isTitleValid ? "text-muted-foreground" : "text-red-500"
                    }`}
                  >
                    {formData.title.length} / {TITLE_MAX}
                    {!isTitleValid && ` (최소 ${TITLE_MIN}자)`}
                  </p>
                </div>

                {/* 카테고리 */}
                <div className="space-y-2">
                  <Label>카테고리</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        category: value as CategoryKey,
                      })
                    }
                  >
                    <SelectTrigger>
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

              {/* 내용 */}
              <div className="space-y-2">
                <Label>내용</Label>
                <Textarea
                  value={formData.content}
                  maxLength={CONTENT_MAX}
                  placeholder="게시글 내용을 입력하세요"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      content: e.target.value.slice(0, CONTENT_MAX),
                    })
                  }
                  className="min-h-72 resize-none"
                />
                <p
                  className={`text-sm text-right ${
                    isContentValid ? "text-muted-foreground" : "text-red-500"
                  }`}
                >
                  {formData.content.length} / {CONTENT_MAX}
                  {!isContentValid && ` (최소 ${CONTENT_MIN}자)`}
                </p>
              </div>

              {/* 이미지 */}
              <div className="space-y-2">
                <Label>첨부 이미지 (선택)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {preview && (
                  <img
                    src={preview}
                    alt="미리보기"
                    className="h-32 w-32 rounded border object-cover"
                  />
                )}
              </div>

              {/* 버튼 */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" asChild>
                  <Link href="/board">취소</Link>
                </Button>
                <Button type="submit" disabled={!isFormValid || isLoading}>
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
