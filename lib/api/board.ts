import { toast } from "react-hot-toast";
import { authFetch } from "../auth-fetch";
import { handleTokenExpired } from "../handle-auth-error";

// 게시판 API 서비스
const API_BASE_URL = "https://front-mission.bigs.or.kr";

// 카테고리 타입 정의
export type CategoryKey = "NOTICE" | "FREE" | "QNA" | "ETC";

export const CATEGORIES: Record<CategoryKey, string> = {
  NOTICE: "공지",
  FREE: "자유",
  QNA: "Q&A",
  ETC: "기타",
};

// 게시글 타입 정의
export interface Post {
  id: number;
  title: string;
  content: string;
  category: CategoryKey;
  boardCategory: CategoryKey;
  createdAt: string;
  boardId?: number;
  imageUrl?: string;
}

export interface PostListResponse {
  content: Post[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface PostCreateRequest {
  title: string;
  content: string;
  category: CategoryKey;
}

// 게시글 목록 조회
export async function getPosts(page = 0, size = 10): Promise<PostListResponse> {
  const res = await authFetch(
    `${API_BASE_URL}/boards?page=${page}&size=${size}`
  );

  if (!res.ok) {
    throw new Error("게시글 목록을 불러오는데 실패했습니다.");
  }

  return res.json();
}

// 게시글 상세 조회
export async function getPost(id: number): Promise<Post> {
  console.log("id", `${API_BASE_URL}/boards/${id}`);
  const res = await authFetch(`${API_BASE_URL}/boards/${id}`);

  if (!res.ok) {
    throw new Error("게시글을 불러오는데 실패했습니다.");
  }

  return res.json();
}

// 게시글 작성
export async function createPost(
  data: PostCreateRequest,
  token: string,
  file?: File
): Promise<Post> {
  const formData = new FormData();

  formData.append(
    "request",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  if (file) formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/boards`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (res.status === 401) {
    handleTokenExpired();
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "게시글 작성 실패");
  }

  return res.json();
}

// 게시글 수정
export async function updatePost(
  id: number,
  data: PostCreateRequest,
  file?: File
): Promise<void> {
  const formData = new FormData();

  formData.append(
    "request",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  if (file) formData.append("file", file);

  const res = await authFetch(`${API_BASE_URL}/boards/${id}`, {
    method: "PATCH",
    body: formData,
  });

  // authFetch 내부에서 401/403 + refresh 처리됨

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "게시글 수정 실패");
  }

  if (res.status === 401) {
    handleTokenExpired();
  }
}

// 게시글 삭제
export async function deletePost(id: number, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/boards/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("게시글 삭제에 실패했습니다.");
}

// 카테고리 목록 조회
export async function getCategories(): Promise<Record<CategoryKey, string>> {
  const res = await fetch(`${API_BASE_URL}/boards/categories`);
  if (!res.ok) return CATEGORIES; // 실패시 기본값 반환
  return res.json();
}
