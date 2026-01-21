"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { signinApi } from "@/lib/api/auth";
import { Toaster, toast } from "react-hot-toast";
import { useAuthStore } from "@/store/auth-store";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  username: string;
  name: string;
}

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [isLoading, setIsLoading] = useState(false);

  const accessToken = useAuthStore((state) => state.accessToken);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && accessToken) {
      router.replace("/board");
    }
  }, [mounted, accessToken, router]);

  const handleLogin = async (data: { username: string; password: string }) => {
    setIsLoading(true);

    try {
      const result = await signinApi(data.username, data.password);

      const decoded = jwtDecode<JwtPayload>(result.accessToken);

      console.log("user info", result, decoded);

      login({
        user: {
          id: decoded.username,
          username: decoded.username,
          name: decoded.name,
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
          <h1 className="text-3xl font-bold">게시판</h1>
          <p className="text-muted-foreground mt-2">게시판 관리 시스템</p>
        </div>

        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
      </div>
    </div>
  );
}
