"use client";

import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { useCreateFolder } from "@/hooks/use-create-folder";
import { useUpdateFolder } from "@/hooks/useUpdateFolder";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useDeleteFolder } from "@/hooks/useDeleteFolder";

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

// For create
interface CreateFolderPayload extends FolderFormData {
  userId: string;
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
  const { toast } = useToast();
  const { mutateAsync: updateFolder } = useUpdateFolder();
  const { mutateAsync: createFolder } = useCreateFolder();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
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

const onSubmit = async (data: FolderFormData) => {
  try {
    if (!userId) {
      throw new Error("User ID not found");
    }

    if (editingFolder) {
      // Update: only send id, name, color
      const updatePayload: UpdateFolderPayload = {
        id: editingFolder.id,
        ...data,
      };
      await updateFolder(updatePayload);

      toast({
        title: "Folder updated",
        description: "Your folder has been updated successfully.",
      });
    } else {
      // Create: send userId + name + color
      const createPayload: CreateFolderPayload = {
        userId,
        ...data,
      };
      await createFolder(createPayload);

      toast({
        title: "Folder created",
        description: "Your new folder has been created successfully.",
      });
    }

    reset();
    setShowForm(false);
    setEditingFolder(null);
  } catch (error) {
    toast({
      title: "Error",
      description: "Something went wrong. Please try again.",
      variant: "destructive",
    });
  }
};


  const handleEdit = (folder: Folder) => {
    setEditingFolder(folder);
    setValue("name", folder.name);
    setValue("color", folder.color);
    setShowForm(true);
  };

const handleDelete = (folderId: string) => {
  deleteFolderMutation.mutate(
    { id: folderId },
    {
      onSuccess: () => {
        const updatedFolders = folders.filter((folder) => folder.id !== folderId);
        onFoldersUpdate(updatedFolders);

        toast({
          title: "Folder deleted",
          description: "The folder has been deleted successfully.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error deleting folder",
          description: error.message,
          variant: "destructive",
        });
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
          <DialogTitle>Manage Folders</DialogTitle>
          <DialogDescription>
            Create, edit, or delete your task folders.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Your Folders</h3>
            <Button className="cursor-pointer" onClick={handleAddNew}>
              <Plus className="w-4 h-4 mr-2 cursor-pointer" />
              Add Folder
            </Button>
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
                        onClick={() => handleDelete(folder.id)}
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
                    <Label htmlFor="name">Folder Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter folder name"
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
                        ? "Update Folder"
                        : "Create Folder"}
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
    </Dialog>
  );
}
