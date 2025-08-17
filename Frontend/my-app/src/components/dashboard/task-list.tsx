"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Calendar, Flag, MoreHorizontal, Search, Tag } from "lucide-react";
import type { Task } from "@/types";
import { format, isToday, isTomorrow, isThisWeek, parseISO } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Folder {
  id: string;
  name: string;
  color?: string;
}

interface TaskListProps {
  selectedFolder: string | null;
  onEditTask: (task: Task) => void;
  tasks: Task[];
  folders: Folder[];
}

export function TaskList({
  selectedFolder,
  onEditTask,
  tasks,
  folders,
}: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  console.log(tasks, "tasks ")

  // ✅ Normalize tasks
  const normalizedTasks = useMemo(
    () =>
      tasks.map((task) => {
        const folder = folders.find((f) => f.id === task.folderId);
        return {
          ...task,
          dueDate: task.dueDate ? parseISO(task.dueDate as any) : undefined,
          folderName: folder?.name ?? "Unknown",
          folderColor: folder?.color ?? "#9CA3AF", // fallback gray
        };
      }),
    [tasks, folders]
  );

  // ✅ Filtering logic
  const filteredTasks = useMemo(
    () =>
      normalizedTasks.filter((task) => {
        if (selectedFolder && task.folderId !== selectedFolder) return false;
        if (
          searchQuery &&
          !task.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
          return false;

        switch (activeTab) {
          case "today":
            return task.dueDate && isToday(task.dueDate);
          case "upcoming":
            return (
              task.dueDate &&
              (isTomorrow(task.dueDate) || isThisWeek(task.dueDate))
            );
          case "completed":
            return task.status === "completed";
          default:
            return true;
        }
      }),
    [normalizedTasks, searchQuery, activeTab, selectedFolder]
  );

  // ✅ Priority badge colors
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {selectedFolder
              ? folders.find((f) => f.id === selectedFolder)?.name ?? "Unknown"
              : "All Tasks"}
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tasks..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No tasks found. Create your first task to get started!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredTasks.map((task) => (
                  <Card
                    key={task.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-3 sm:space-y-0">
                        <Checkbox
                          checked={task.status === "completed"}
                          // ⚡ You can later wire this to backend update
                          onCheckedChange={() =>
                            console.log("toggle status", task.id)
                          }
                          className="mt-1"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                            <div>
                              <h3
                                className={`font-medium ${
                                  task.status === "completed"
                                    ? "line-through text-gray-500"
                                    : "text-gray-900 dark:text-white"
                                }`}
                              >
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {task.description}
                                </p>
                              )}
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => onEditTask(task)}
                                >
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    console.log("delete task", task.id)
                                  }
                                  className="text-red-600"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="flex flex-wrap gap-3 mt-3">
                            <Badge className={getPriorityColor(task.priority)}>
                              <Flag className="w-3 h-3 mr-1" />
                              {task.priority}
                            </Badge>

                            {task.dueDate && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="w-4 h-4 mr-1" />
                                {format(task.dueDate, "MMM dd, yyyy")}
                              </div>
                            )}

                            {!selectedFolder && (
                              <div className="flex items-center text-sm text-gray-500">
                                <div
                                  className="w-3 h-3 rounded-full mr-1"
                                  style={{
                                    backgroundColor: task.folderColor,
                                  }}
                                />
                                {task.folderName}
                              </div>
                            )}

                            {task.tags.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <Tag className="w-3 h-3 text-gray-400" />
                                {task.tags.slice(0, 2).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {task.tags.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{task.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
