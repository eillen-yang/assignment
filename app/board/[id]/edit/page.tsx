"use client";

import type React from "react";
import { useEffect, useState, useMemo } from "react";
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

import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { CategoryKey, getPost, updatePost } from "@/lib/api/board";

const TITLE_MIN = 5;
const TITLE_MAX = 50;
const CONTENT_MIN = 20;
const CONTENT_MAX = 250;

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const postId = Number(params.id);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    boardCategory: "",
  });

  useEffect(() => {
    if (!postId || Number.isNaN(postId)) {
      setError("잘못된 접근입니다.");
      setIsFetching(false);
      return;
    }

    const fetchPost = async () => {
      try {
        const data = await getPost(postId);
        setFormData({
          title: data.title,
          content: data.content,
          boardCategory: data.boardCategory,
        });
      } catch (err) {
        console.error(err);
        setError("게시글을 불러오지 못했습니다.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchPost();
  }, [postId]);

  const isTitleValid =
    formData.title.length >= TITLE_MIN && formData.title.length <= TITLE_MAX;

  const isContentValid =
    formData.content.length >= CONTENT_MIN &&
    formData.content.length <= CONTENT_MAX;

  const isFormValid = useMemo(() => {
    return isTitleValid && isContentValid && Boolean(formData.boardCategory);
  }, [isTitleValid, isContentValid, formData.boardCategory]);

  if (isFetching) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-xl font-bold mb-2">{error}</h1>
          <Button asChild>
            <Link href="/board">목록으로 돌아가기</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      alert("입력 조건을 다시 확인해주세요.");
      return;
    }

    try {
      setIsLoading(true);

      await updatePost(postId, {
        title: formData.title,
        content: formData.content,
        category: formData.boardCategory as CategoryKey,
      });

      router.push(`/board/${postId}`);
    } catch (err) {
      console.error(err);
      alert("게시글 수정에 실패했습니다.");
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
            <Link href={`/board/${postId}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">글 수정</h1>
            <p className="text-muted-foreground">게시글을 수정합니다</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>게시글 수정</CardTitle>
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
                    value={formData.boardCategory}
                    onValueChange={(value) =>
                      setFormData({ ...formData, boardCategory: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NOTICE">공지</SelectItem>
                      <SelectItem value="FREE">자유</SelectItem>
                      <SelectItem value="QNA">Q&A</SelectItem>
                      <SelectItem value="ETC">기타</SelectItem>
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

              {/* 버튼 */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" asChild>
                  <Link href={`/board/${postId}`}>취소</Link>
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
