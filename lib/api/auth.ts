export interface SignupRequest {
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export interface SignInResponse {
  id: string;
  username: string;
  name: string;
  accessToken: string;
  refreshToken: string;
}

export async function signinApi(
  username: string,
  password: string
): Promise<SignInResponse> {
  const res = await fetch("https://front-mission.bigs.or.kr/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("SIGN_IN_FAILED");
  }

  return res.json();
}

export async function signupApi(data: SignupRequest) {
  const res = await fetch("https://front-mission.bigs.or.kr/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const text = await res.text();
  const result = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(result?.message || "회원가입에 실패했습니다.");
  }

  return result;
}
