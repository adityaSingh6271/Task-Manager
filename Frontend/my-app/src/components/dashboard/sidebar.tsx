import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Folder, LayoutList, Menu, Plus, Search, Settings, StickyNote, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { Folder as FolderType } from "@/types";
import { FolderManager } from "./folder-manager";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useProfile } from "@/hooks/useProfile";

interface SidebarProps {
  selectedFolder: string | null;
  onFolderSelect: (folderId: string | null) => void;
}

export function Sidebar({ selectedFolder, onFolderSelect }: SidebarProps) {
  const { data } = useProfile();
  const router = useRouter();
  const pathname = usePathname();

  // Use folders from API, fall back to empty array
  const [folders, setFolders] = useState<FolderType[]>([]);

  useEffect(() => {
    if (data?.folders) {
      setFolders(data.folders ?? []);
    }
  }, [data]);

  const [showFolderManager, setShowFolderManager] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleFolderUpdate = (updatedFolders: FolderType[]) => {
    setFolders(updatedFolders);
  };

  const SidebarContent = (
    <div className="w-64 bg-sidebar border-r border-border h-full flex flex-col z-50">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Search projects…" className="pl-10" />
        </div>
        {isMobile && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsSidebarOpen(false)}
            className="ml-2"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Workspace</p>
          <Button
            variant={pathname === "/dashboard" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => { onFolderSelect(null); router.push("/dashboard"); }}
          >
            <LayoutList className="w-4 h-4 mr-2" />
            Today
          </Button>
          <Button variant={pathname === "/calendar" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => router.push("/calendar")}><CalendarDays className="w-4 h-4 mr-2" />Calendar</Button>
          <Button variant={pathname === "/notes" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => router.push("/notes")}><StickyNote className="w-4 h-4 mr-2" />Notes</Button>
          <Button variant={pathname === "/projects" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => router.push("/projects")}><Folder className="w-4 h-4 mr-2" />Projects</Button>

          <div className="mt-5 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Projects
              </h3>
              <Button
              className="cursor-pointer"
                size="sm"
                variant="ghost"
                onClick={() => setShowFolderManager(true)}
              >
                <Plus className="w-4 h-4 cursor-pointer" />
              </Button>
            </div>

            {folders.map((folder) => (
              <Button
                key={folder.id}
                variant={selectedFolder === folder.id ? "secondary" : "ghost"}
                className="w-full justify-between group"
                onClick={() => {
                  onFolderSelect(folder.id);
                  setIsSidebarOpen(false);
                }}
              >
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: folder.color }}
                  />
                  <span className="truncate">{folder.name}</span>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {folder.taskCount}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setShowFolderManager(true)}
        >
          <Settings className="w-4 h-4 mr-2" />
          Manage Projects
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {isMobile && !isSidebarOpen && (
        <Button
          onClick={() => setIsSidebarOpen(true)}
          variant="ghost"
          className="fixed top-4 left-4 z-50 md:hidden bg-background shadow-md"
        >
          <Menu className="w-6 h-6" />
        </Button>
      )}
      {isMobile
        ? isSidebarOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
              <div className="absolute left-0 top-0 bottom-0">
                {SidebarContent}
              </div>
            </div>
          )
        : SidebarContent}

      <FolderManager
        open={showFolderManager}
        onOpenChange={setShowFolderManager}
        folders={folders}
        onFoldersUpdate={handleFolderUpdate}
      />
    </>
  );
}
