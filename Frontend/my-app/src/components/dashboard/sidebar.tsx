"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CalendarDays,
  Folder,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings,
  StickyNote,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { Folder as FolderType } from "@/types";
import { FolderManager } from "./folder-manager";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useProfile } from "@/hooks/useProfile";

interface SidebarProps {
  selectedFolder: string | null;
  onFolderSelect: (folderId: string | null) => void;
}

const navItems = [
  { href: "/dashboard", label: "Today", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/notes", label: "Notes", icon: StickyNote },
  { href: "/projects", label: "Projects", icon: Folder },
];

export function Sidebar({ selectedFolder, onFolderSelect }: SidebarProps) {
  const { data } = useProfile();
  const router = useRouter();
  const pathname = usePathname();
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [search, setSearch] = useState("");
  const [showFolderManager, setShowFolderManager] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (data?.folders) setFolders(data.folders ?? []);
  }, [data]);

  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const SidebarContent = (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* ── Header ──────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-3.5">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 border-foreground/10 bg-foreground/5 pl-9 text-xs focus:border-indigo-500/40"
          />
        </div>
        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-foreground/10 text-muted-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Nav items ───────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-5">
          <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Workspace
          </p>
          <div className="space-y-0.5">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <button
                  key={href}
                  onClick={() => {
                    if (href === "/dashboard") onFolderSelect(null);
                    router.push(href);
                    if (isMobile) setIsSidebarOpen(false);
                  }}
                  className={`group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-indigo-500/15 text-indigo-400 shadow-sm"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all ${
                      active
                        ? "bg-indigo-500/20 border border-indigo-500/30"
                        : "border border-transparent group-hover:border-foreground/10 group-hover:bg-foreground/5"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  {label}
                  {active && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Projects list ──────────────────────────── */}
        <div>
          <div className="mb-1.5 flex items-center justify-between px-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              Projects
            </p>
            <button
              onClick={() => setShowFolderManager(true)}
              className="flex h-5 w-5 items-center justify-center rounded-md hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
              title="Add project"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {filteredFolders.length === 0 && search && (
            <p className="px-3 py-3 text-xs text-muted-foreground">
              No projects match &ldquo;{search}&rdquo;
            </p>
          )}

          {filteredFolders.length === 0 && !search && (
            <button
              onClick={() => setShowFolderManager(true)}
              className="mt-1 flex w-full items-center gap-2 rounded-xl border border-dashed border-foreground/10 px-3 py-3 text-xs text-muted-foreground transition-colors hover:border-indigo-500/30 hover:text-indigo-400"
            >
              <Plus className="h-3.5 w-3.5" />
              Create your first project
            </button>
          )}

          <div className="mt-1 space-y-0.5">
            {filteredFolders.map((folder) => {
              const active = selectedFolder === folder.id;
              return (
                <button
                  key={folder.id}
                  onClick={() => {
                    onFolderSelect(folder.id);
                    if (isMobile) setIsSidebarOpen(false);
                  }}
                  className={`group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all duration-150 ${
                    active
                      ? "bg-foreground/8 text-foreground"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  <div
                    className="h-3 w-3 shrink-0 rounded-full ring-1 ring-black/20"
                    style={{ backgroundColor: folder.color }}
                  />
                  <span className="min-w-0 flex-1 truncate text-left text-[13px]">
                    {folder.name}
                  </span>
                  {folder.taskCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-auto shrink-0 rounded-full bg-foreground/8 text-[10px] font-medium text-muted-foreground"
                    >
                      {folder.taskCount}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────── */}
      <div className="border-t border-sidebar-border px-3 py-3">
        <button
          onClick={() => setShowFolderManager(true)}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
          Manage Projects
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && !isSidebarOpen && (
        <Button
          onClick={() => setIsSidebarOpen(true)}
          variant="ghost"
          size="icon"
          className="fixed left-4 top-4 z-50 bg-card shadow-lg border border-foreground/10 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Mobile overlay */}
      {isMobile ? (
        isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          >
            <div
              className="absolute left-0 top-0 h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {SidebarContent}
            </div>
          </div>
        )
      ) : (
        SidebarContent
      )}

      <FolderManager
        open={showFolderManager}
        onOpenChange={setShowFolderManager}
        folders={folders}
        onFoldersUpdate={(updated) => setFolders(updated)}
      />
    </>
  );
}
