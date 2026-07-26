"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2, Plus } from "lucide-react";
import type { Folder } from "@/types";
import { useCreateFolder } from "@/hooks/use-create-folder";
import { useUpdateFolder } from "@/hooks/useUpdateFolder";
import { useDeleteFolder } from "@/hooks/useDeleteFolder";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface FolderManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: Folder[];
  onFoldersUpdate: (folders: Folder[]) => void;
}

interface FolderFormData {
  name: string;
  color: string;
}

// For update
interface UpdateFolderPayload extends FolderFormData {
  id: string;
}

const colorOptions = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
];

export function FolderManager({
  open,
  onOpenChange,
  folders,
  onFoldersUpdate,
}: FolderManagerProps) {
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Folder | null>(null);
  const { mutateAsync: updateFolder } = useUpdateFolder();
  const { mutateAsync: createFolder } = useCreateFolder();
  const deleteFolderMutation = useDeleteFolder()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FolderFormData>();

  const watchedColor = watch("color", colorOptions[0]);

  useEffect(() => {
    if (open && folders.length === 0) handleAddNew();
  }, [open, folders.length]);

const onSubmit = async (data: FolderFormData) => {
  try {
    if (editingFolder) {
      // Update: only send id, name, color
      const updatePayload: UpdateFolderPayload = {
        id: editingFolder.id,
        ...data,
      };
      await updateFolder(updatePayload);

    } else {
      await createFolder(data);

    }

    reset();
    setShowForm(false);
    setEditingFolder(null);
  } catch { /* Mutation hooks show the error toast. */ }
};


  const handleEdit = (folder: Folder) => {
    setEditingFolder(folder);
    setValue("name", folder.name);
    setValue("color", folder.color);
    setShowForm(true);
  };

const handleDelete = () => {
  if (!projectToDelete) return;
  deleteFolderMutation.mutate(
    { id: projectToDelete.id },
    {
      onSuccess: () => {
        const updatedFolders = folders.filter((folder) => folder.id !== projectToDelete.id);
        onFoldersUpdate(updatedFolders);
        setProjectToDelete(null);
      },
    }
  );
}

  const handleAddNew = () => {
    setEditingFolder(null);
    reset();
    setValue("color", colorOptions[0]);
    setShowForm(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Projects</DialogTitle>
          <DialogDescription>
            Create, edit, or delete the projects that organize your tasks.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Your Projects</h3>
            {!showForm && <Button className="cursor-pointer" onClick={handleAddNew}>
              <Plus className="w-4 h-4 mr-2 cursor-pointer" />
              Add Project
            </Button>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {folders.map((folder) => (
              <Card key={folder.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: folder.color }}
                      />
                      <div>
                        <h4 className="font-medium">{folder.name}</h4>
                        <p className="text-sm text-gray-500">
                          {folder.taskCount} tasks
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        className="cursor-pointer"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(folder)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label={`Delete ${folder.name}`}
                        onClick={() => setProjectToDelete(folder)}
                        className="text-red-600 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {showForm && (
            <Card>
              <CardContent className="p-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Product launch"
                      {...register("name", {
                        required: "Folder name is required",
                      })}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex space-x-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 cursor-pointer ${
                            watchedColor === color
                              ? "border-gray-900 dark:border-white"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setValue("color", color)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      className="cursor-pointer"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? editingFolder
                          ? "Updating..."
                          : "Creating..."
                        : editingFolder
                        ? "Update project"
                        : "Create project"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setEditingFolder(null);
                        reset();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{projectToDelete?.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the project and its {projectToDelete?.taskCount ?? 0} task{projectToDelete?.taskCount === 1 ? "" : "s"}. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep project</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={handleDelete}>Delete project and tasks</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
