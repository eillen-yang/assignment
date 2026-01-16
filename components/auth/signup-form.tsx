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
import { FileText, Eye, EyeOff, Loader2, Check, X } from "lucide-react";

export function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const passwordRequirements = [
    { label: "8자 이상", valid: formData.password.length >= 8 },
    { label: "영문 포함", valid: /[a-zA-Z]/.test(formData.password) },
    { label: "숫자 포함", valid: /\d/.test(formData.password) },
  ];

  const passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return;

    setIsLoading(true);

    // UI 데모용 - 실제 회원가입 로직은 나중에 구현
    setTimeout(() => {
      setIsLoading(false);
      router.push("/login");
    }, 1000);
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-card-foreground">
          회원가입
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          새 계정을 만들어 서비스를 시작하세요
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-card-foreground">
              이름
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="홍길동"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-card-foreground">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-card-foreground">
              비밀번호
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="bg-input border-border text-foreground placeholder:text-muted-foreground pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {formData.password && (
              <div className="flex flex-wrap gap-2 mt-2">
                {passwordRequirements.map((req) => (
                  <span
                    key={req.label}
                    className={`text-xs flex items-center gap-1 ${
                      req.valid ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {req.valid ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    {req.label}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-card-foreground">
              비밀번호 확인
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="bg-input border-border text-foreground placeholder:text-muted-foreground pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {formData.confirmPassword && (
              <p
                className={`text-xs flex items-center gap-1 ${
                  passwordsMatch ? "text-primary" : "text-destructive"
                }`}
              >
                {passwordsMatch ? (
                  <>
                    <Check className="h-3 w-3" /> 비밀번호가 일치합니다
                  </>
                ) : (
                  <>
                    <X className="h-3 w-3" /> 비밀번호가 일치하지 않습니다
                  </>
                )}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !passwordsMatch}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                가입 중...
              </>
            ) : (
              "회원가입"
            )}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-primary hover:underline">
              로그인
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
