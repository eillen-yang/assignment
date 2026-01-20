"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignupForm, SignupFormData } from "@/components/auth/signup-form";
import { isValidEmail } from "@/lib/validators";
import { signupApi } from "@/lib/api/auth";
import { Toaster, toast } from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async () => {
    const { name, username, password, confirmPassword } = formData;

    if (!name.trim()) {
      toast.error("이름을 입력해주세요.");
      return;
    }

    if (!username.trim()) {
      toast.error("이메일을 입력해주세요.");
      return;
    }

    if (!isValidEmail(username)) {
      toast.error("이메일 형식의 아이디를 입력해주세요.");
      return;
    }

    if (!password.trim()) {
      toast.error("비밀번호를 입력해주세요.");
      return;
    }

    if (!confirmPassword.trim()) {
      toast.error("비밀번호 확인을 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setIsLoading(true);

      await signupApi({
        username,
        password,
        confirmPassword,
        name,
      });

      toast.success("회원가입이 완료되었습니다.");
      router.push("/auth/login");
    } catch (error: any) {
      if (error && typeof error === "object") {
        // username, password 등 첫 번째 에러 메시지 출력
        const firstKey = Object.keys(error)[0];

        if (firstKey && Array.isArray(error[firstKey])) {
          toast.error(error[firstKey][0]);
          return;
        }
      }

      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }

      toast.error("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Toaster
        toastOptions={{
          style: { fontSize: "14px" },
        }}
        containerStyle={{ top: 20 }}
      />
      <div className="w-full max-w-md">
        <SignupForm
          value={formData}
          isLoading={isLoading}
          onChange={setFormData}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
