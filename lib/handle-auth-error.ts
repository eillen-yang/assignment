import { useAuthStore } from "@/store/auth-store";

export function handleTokenExpired() {
  alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");

  const { logout } = useAuthStore.getState();
  logout();

  window.location.href = "/auth/login";
}
