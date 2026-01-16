// lib/auth-refresh.ts
import { useAuthStore } from "./auth-store";

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token");

  const res = await fetch("https://front-mission.bigs.or.kr/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Refresh failed");

  const data = await res.json();
  useAuthStore.getState().setAccessToken(data.accessToken);

  return data.accessToken;
}
