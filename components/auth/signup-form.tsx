"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Check, X, FileText } from "lucide-react";
import { isValidEmail } from "@/lib/validators";

/** 🔹 form 데이터 타입 */
export type SignupFormData = {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
};

type SignupFormProps = {
  value: SignupFormData;
  isLoading: boolean;
  onChange: (value: SignupFormData) => void;
  onSubmit: () => void;
};

export function SignupForm({
  value,
  isLoading,
  onChange,
  onSubmit,
}: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isEmailValid = isValidEmail(value.username);

  /** 🔹 비밀번호 요구사항 (UI 파생 상태) */
  const passwordRequirements = useMemo(
    () => [
      { label: "8자 이상", valid: value.password.length >= 8 },
      { label: "영문 포함", valid: /[a-zA-Z]/.test(value.password) },
      { label: "숫자 포함", valid: /\d/.test(value.password) },
      {
        label: "특수문자 포함",
        valid: /[!@#$%^&*(),.?":{}|<>[\]\\/~`+=_-]/.test(value.password),
      },
    ],
    [value.password]
  );

  const isPasswordValid = passwordRequirements.every((req) => req.valid);

  const passwordsMatch =
    value.password === value.confirmPassword &&
    value.confirmPassword.length > 0;

  return (
    <Card>
      <CardHeader className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
        <CardDescription>새 계정을 만들어 서비스를 시작하세요</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 이름 */}
        <div className="space-y-1">
          <Label>이름</Label>
          <Input
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            placeholder="홍길동"
            required
          />
        </div>

        {/* 아이디 */}
        <div className="space-y-1">
          <Label>아이디</Label>
          <Input
            value={value.username}
            onChange={(e) => onChange({ ...value, username: e.target.value })}
            placeholder="name@example.com"
            required
          />

          {value.username && !isEmailValid && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <X className="h-3 w-3" />
              이메일 형식이 아닙니다
            </p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="space-y-1">
          <Label>비밀번호</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={value.password}
              onChange={(e) => onChange({ ...value, password: e.target.value })}
              placeholder="••••••••"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </Button>
          </div>

          {value.password && (
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

        {/* 비밀번호 확인 */}
        <div className="space-y-1">
          <Label>비밀번호 확인</Label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={value.confirmPassword}
              onChange={(e) =>
                onChange({
                  ...value,
                  confirmPassword: e.target.value,
                })
              }
              placeholder="••••••••"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <Eye /> : <EyeOff />}
            </Button>
          </div>

          {value.confirmPassword && (
            <p
              className={`text-xs flex items-center gap-1 mt-1 ${
                passwordsMatch ? "text-primary" : "text-destructive"
              }`}
            >
              {passwordsMatch ? (
                <>
                  <Check className="h-3 w-3" />
                  비밀번호가 일치합니다
                </>
              ) : (
                <>
                  <X className="h-3 w-3" />
                  비밀번호가 일치하지 않습니다
                </>
              )}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <Button
          className="w-full"
          type="submit"
          disabled={
            isLoading || !passwordsMatch || !isEmailValid || !isPasswordValid
          }
          onClick={onSubmit}
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
          <Link href="/auth/login" className="text-primary hover:underline">
            로그인
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
