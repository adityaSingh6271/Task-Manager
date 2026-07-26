"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import type { CreateTaskData, Folder, Task } from "@/types";
import { useCreateTask } from "@/hooks/use-create-task";
import { useUpdateTask } from "@/hooks/useUpdateTask";

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: (Task & { folderId?: string }) | null; 
  onTaskSave: (task: Task) => void;
  folders: Folder[];
  taskFolderId: string
}

export function TaskForm({ open, onOpenChange, task, folders }: TaskFormProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskData>();

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  useEffect(() => {
    if (task) {
      // Editing existing task
      setValue("title", task.title);
      setValue("description", task.description || "");
      setValue("priority", task.priority);
      setValue("dueDate", task.dueDate ? (typeof task.dueDate === "string" ? new Date(task.dueDate) : task.dueDate) : undefined);
      // Now task will have folderId from the TaskList component
      setValue("folderId", task.folderId);
      setTags(task.tags || []);
    } else {
      // Creating new task
      reset();
      setTags([]);
      setTagInput("");
    }
  }, [task, setValue, reset]);

  const onSubmit = async (data: CreateTaskData) => {
    try {
      if (task) {
        // 🔹 Update existing task
        await updateTask.mutateAsync({
          id: task.id,
          data: {
            ...data,
            tags,
          },
        });

      } else {
        // 🔹 Create new task
        await createTask.mutateAsync({
          ...data,
          tags,
        });

      }

      // cleanup
      onOpenChange(false);
      reset();
      setTags([]);
      setTagInput("");
    } catch { /* Mutation hooks show the error toast. */ }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xs md:max-w-sm lg:max-w-md p-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{task ? "Edit Task" : "Create New Task"}</SheetTitle>
          <SheetDescription>
            {task
              ? "Make changes to your task here."
              : "Add a new task to your list. Fill in the details below."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter task title"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task description (optional)"
              rows={3}
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority *</Label>
              <Controller
                name="priority"
                control={control}
                rules={{ required: "Priority is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">LOW</SelectItem>
                      <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                      <SelectItem value="HIGH">HIGH</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.priority && (
                <p className="text-sm text-red-600">
                  {errors.priority.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Folder *</Label>
              <Controller
                name="folderId"
                control={control}
                rules={{ required: "Folder is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select folder" />
                    </SelectTrigger>
                    <SelectContent>
                      {folders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id}>
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: folder.color }}
                            />
                            {folder.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.folderId && (
                <p className="text-sm text-red-600">
                  {errors.folderId.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Controller
              name="dueDate"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-transparent"
                        type="button"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={(date) => {
                          field.onChange(date);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {fieldState.error && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 cursor-pointer"
            >
              {isSubmitting
                ? task
                  ? "Updating..."
                  : "Creating..."
                : task
                ? "Update Task"
                : "Create Task"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
