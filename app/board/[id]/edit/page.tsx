"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { CategoryKey, getPost, updatePost } from "@/lib/api/board";
import { BoardForm } from "@/components/board/board-form";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const postId = Number(params.id);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [initialValues, setInitialValues] = useState<{
    title: string;
    content: string;
    category: CategoryKey;
  } | null>(null);

  const [existingImage, setExistingImage] = useState<string | null>(null);

  useEffect(() => {
    if (!postId || Number.isNaN(postId)) {
      setError("잘못된 접근입니다.");
      setIsFetching(false);
      return;
    }

    const fetchPost = async () => {
      try {
        const data = await getPost(postId);

        setInitialValues({
          title: data.title,
          content: data.content,
          category: data.boardCategory as CategoryKey,
        });

        setExistingImage(
          data.imageUrl
            ? data.imageUrl.startsWith("http")
              ? data.imageUrl
              : `${process.env.NEXT_PUBLIC_API_URL}${data.imageUrl}`
            : null
        );
      } catch (err) {
        console.error(err);
        setError("게시글을 불러오지 못했습니다.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (isFetching) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !initialValues) {
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
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
            <CardTitle>게시글 작성</CardTitle>
          </CardHeader>
          <CardContent>
            <BoardForm
              initialValues={initialValues}
              initialImageUrl={existingImage}
              submitLabel="수정"
              loading={isLoading}
              onSubmit={async (data, { file, removeImage }) => {
                if (!data.category) {
                  toast.error("카테고리를 선택해주세요.");
                  return;
                }

                try {
                  setIsLoading(true);

                  await updatePost(
                    postId,
                    {
                      title: data.title,
                      content: data.content,
                      category: data.category,
                      removeImage,
                    },
                    file
                  );

                  router.push(`/board/${postId}`);
                } finally {
                  setIsLoading(false);
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
