"use client";

import type React from "react";
import { DashboardHeader } from "@/components/dashboard-header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-4 lg:p-6 max-w-5xl">{children}</main>
    </div>
  );
}
