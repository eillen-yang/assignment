"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { LoginForm } from "@/components/auth/login-form";
import { signinApi } from "@/lib/api/auth";
import { Toaster, toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: { username: string; password: string }) => {
    setIsLoading(true);

    try {
      const result = await signinApi(data.username, data.password);

      login({
        user: {
          id: result.id,
          username: result.username,
          name: result.name,
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });

      toast.success("로그인 성공!");
      router.push("/board");
    } catch {
      toast.error("아이디 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Toaster
        toastOptions={{
          style: { fontSize: "14px" },
        }}
        containerStyle={{ top: 20 }}
      />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">게시판 관리 시스템</p>
        </div>

        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
      </div>
    </div>
  );
}
