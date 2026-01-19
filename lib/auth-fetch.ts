import { useAuthStore } from "@/store/auth-store";
import { refreshAccessToken } from "./auth-refresh";

let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

export async function authFetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const store = useAuthStore.getState();

  // ✅ hydration 완료 대기
  if (!store.hasHydrated) {
    await new Promise((resolve) => {
      const unsub = useAuthStore.subscribe((state) => {
        if (state.hasHydrated) {
          unsub();
          resolve(true);
        }
      });
    });
  }

  let accessToken = store.accessToken;

  const doFetch = (token?: string) =>
    fetch(input, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  // 🔹 토큰 없어도 요청은 보냄 (public API 허용)
  let response = await doFetch(accessToken ?? undefined);

  // ✅ refresh는 401만 처리
  if (response.status !== 401) {
    return response;
  }

  // 🔁 이미 refresh 중이면 큐에 대기
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      refreshQueue.push((newToken) => {
        doFetch(newToken).then(resolve).catch(reject);
      });
    });
  }

  isRefreshing = true;

  try {
    const newAccessToken = await refreshAccessToken();

    refreshQueue.forEach((cb) => cb(newAccessToken));
    refreshQueue = [];

    return doFetch(newAccessToken);
  } catch (e) {
    refreshQueue = [];
    store.logout();
    throw e;
  } finally {
    isRefreshing = false;
  }
}
