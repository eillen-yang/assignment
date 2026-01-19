"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, FileText } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export function DashboardHeader() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60">
      <div className="container mx-auto max-w-5xl">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          {/* 로고 및 네비게이션 */}
          <div className="flex items-center gap-6">
            <Link href="/board" className="text-lg font-bold text-foreground">
              Board
            </Link>
            <nav className="hidden sm:flex items-center gap-4">
              <Link
                href="/board"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <FileText className="h-4 w-4" />
                게시판
              </Link>
            </nav>
          </div>

          {/* 사용자 정보 */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex flex-col items-end text-sm">
                <span className="font-medium text-foreground">{user.name}</span>
                <span className="text-xs text-muted-foreground">
                  @{user.username}
                </span>
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {user ? (
                      <span className="text-sm font-medium">
                        {user.name.charAt(0)}
                      </span>
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <span className="sr-only">사용자 메뉴</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {user ? (
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        @{user.username}
                      </p>
                    </div>
                  ) : (
                    "내 계정"
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  설정
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
