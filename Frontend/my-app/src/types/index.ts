export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface User { id: string; name: string; email: string; avatar?: string; }

export interface Folder {
  id: string;
  name: string;
  color: string;
  taskCount: number;
  tasks?: Task[];
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | Date | null;
  tags: string[];
  folderId: string;
  isPriority?: boolean;
  priorityOrder?: number | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Event {
  id: string;
  title: string;
  description?: string | null;
  startAt: string;
  endAt: string;
  allDay: boolean;
  folderId?: string | null;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: Date | null;
  tags?: string[];
  folderId: string;
  isPriority?: boolean;
  priorityOrder?: number | null;
}

export interface RegisterData { email: string; password: string; confirmPassword: string; }
export interface LoginData { email: string; password: string; }
export interface OTPData { email: string; otp?: string; }

export interface ProfileData {
  user: User;
  folders: Folder[];
}
