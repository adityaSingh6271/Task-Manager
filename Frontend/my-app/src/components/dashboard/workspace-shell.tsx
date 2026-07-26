"use client";

import type { ReactNode } from "react";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { useProfile } from "@/hooks/useProfile";

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const { data, isLoading } = useProfile();
  return <div className="min-h-screen bg-background text-foreground"><Header user={data?.user} isLoading={isLoading} /><div className="flex min-h-[calc(100vh-73px)]"><aside className="hidden w-72 shrink-0 border-r border-border bg-sidebar lg:block"><Sidebar selectedFolder={null} onFolderSelect={() => undefined} /></aside><div className="min-w-0 flex-1">{children}</div></div></div>;
}
