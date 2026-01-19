import { useAuthStore } from "@/store/auth-store";

export async function refreshAccessToken(): Promise<string> {
  const store = useAuthStore.getState();
  const refreshToken = store.refreshToken;

  if (!refreshToken) {
    store.logout();
    throw new Error("No refresh token");
  }

  const res = await fetch("https://front-mission.bigs.or.kr/auth/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    store.logout();
    throw new Error("Refresh failed");
  }

  const data: {
    accessToken: string;
    refreshToken?: string;
  } = await res.json();

  store.setAccessToken(data.accessToken);

  // 서버가 refreshToken도 다시 내려주는 경우
  if (data.refreshToken) {
    store.setRefreshToken(data.refreshToken);
  }

  return data.accessToken;
}
