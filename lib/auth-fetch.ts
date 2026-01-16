// lib/auth-fetch.ts
import { useAuthStore } from "./auth-store";
import { refreshAccessToken } from "./auth-refresh";

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const { accessToken, logout } = useAuthStore.getState();

  const res = await fetch(input, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // accessToken 만료
  if (res.status === 401) {
    try {
      const newToken = await refreshAccessToken();

      return fetch(input, {
        ...init,
        headers: {
          ...init.headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
    } catch {
      logout();
      throw new Error("인증 만료");
    }
  }

  return res;
}
