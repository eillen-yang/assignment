"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "", // 아이디 필드 추가
    password: "",
  });

  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 실제 API 연동 시 여기서 로그인 요청
    await new Promise((resolve) => setTimeout(resolve, 1000));

    login({
      id: "1",
      username: formData.username,
      name: formData.username, // 실제 API에서 받아올 이름
      email: `${formData.username}@example.com`,
    });

    setIsLoading(false);
    router.push("/board");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">게시판 관리 시스템</p>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">로그인</CardTitle>
            <CardDescription className="text-center">
              계정에 로그인하여 게시판을 이용하세요
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">아이디</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="아이디를 입력하세요"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    className="bg-input border-border pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    로그인 중...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    로그인
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                계정이 없으신가요?{" "}
                <Link
                  href="/auth/signup"
                  className="text-primary hover:underline"
                >
                  회원가입
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
