export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

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
  description?: string;
  TaskStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: Date;
  tags: string[];
  folderId: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  taskCount: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status:"PENDING" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: Date;
  tags: string[];
  folderId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: Date;
  tags: string[];
  folderId: string;
}

export interface RegisterData {
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface OTPData {
  mobile: string;
  otp?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface OTPData {
  mobile: string;
  otp?: string;
}

export interface ProfileData {
  user: User;
  folders: Folder[];
  tasks: Task[];
  registerData?: RegisterData;
  loginData?: LoginData;
  otpData?: OTPData;
}
