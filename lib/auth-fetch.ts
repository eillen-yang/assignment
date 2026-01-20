"use client";

import { useAuthStore } from "@/store/auth-store";
import { refreshAccessToken } from "./auth-refresh";
import { redirect } from "next/navigation";

let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

/**
 * 서버/클라이언트 겸용 authFetch
 * - 401 시 토큰 자동 갱신 시도
 * - refresh 중복 방지, 큐 처리
 * - 갱신 실패 시 로그아웃 + 로그인 페이지 리다이렉트
 */
export async function authFetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const store = useAuthStore.getState();

  // 클라이언트: hydration 완료 대기
  if (typeof window !== "undefined" && !store.hasHydrated) {
    await new Promise<void>((resolve) => {
      const unsub = useAuthStore.subscribe((state) => {
        if (state.hasHydrated) {
          unsub();
          resolve();
        }
      });
    });
  }

  // 실제 fetch 요청 (토큰 적용)
  const doFetchWithToken = (token?: string) =>
    fetch(input, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  // 1️⃣ 최초 요청
  let accessToken = store.accessToken ?? undefined;
  let response = await doFetchWithToken(accessToken);

  if (response.status !== 401) return response;

  // 2️⃣ 401 처리 (refresh)
  return handleUnauthorized(doFetchWithToken, store);
}

// 🔹 401 처리 함수 (토큰 갱신 + 큐 관리)
async function handleUnauthorized(
  doFetchWithToken: (token?: string) => Promise<Response>,
  store: ReturnType<typeof useAuthStore.getState>
): Promise<Response> {
  if (isRefreshing) {
    // refresh 중이면 큐에 대기
    return new Promise((resolve, reject) => {
      refreshQueue.push((newToken) => {
        doFetchWithToken(newToken).then(resolve).catch(reject);
      });
    });
  }

  isRefreshing = true;

  try {
    const newAccessToken = await refreshAccessToken();

    // 큐 처리
    refreshQueue.forEach((cb) => cb(newAccessToken));
    refreshQueue = [];

    return doFetchWithToken(newAccessToken);
  } catch (err) {
    refreshQueue = [];
    store.logout();

    // 클라이언트 vs 서버 환경
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    } else {
      redirect("/login");
    }

    throw err;
  } finally {
    isRefreshing = false;
  }
}
