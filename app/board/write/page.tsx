"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BoardForm } from "@/components/board/board-form";
import { createPost, CategoryKey } from "@/lib/api/board";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "react-hot-toast";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function WritePage() {
  const router = useRouter();
  const params = useParams();
  const postId = Number(params.id);
  const { accessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

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
            <h1 className="text-2xl font-bold">글 작성</h1>
            <p className="text-muted-foreground">게시글을 작성합니다</p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>게시글 작성</CardTitle>
          </CardHeader>
          <CardContent>
            <BoardForm
              initialValues={{ title: "", content: "", category: "" }}
              loading={isLoading}
              onSubmit={async (data, { file }) => {
                if (!data.category) {
                  toast.error("카테고리를 선택해주세요.");
                  return;
                }

                if (!accessToken) {
                  toast.error("로그인이 필요합니다.");
                  router.push("/auth/login");
                  return;
                }

                try {
                  setIsLoading(true);

                  await createPost(
                    {
                      title: data.title,
                      content: data.content,
                      category: data.category,
                    },
                    accessToken,
                    file
                  );

                  router.push("/board");
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
