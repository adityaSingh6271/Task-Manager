import type { Folder, Task, User } from "@/types"

export const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  avatar: "/placeholder.svg?height=40&width=40",
}

export const mockFolders: Folder[] = [
  { id: "1", name: "Personal", color: "#3B82F6", taskCount: 12 },
  { id: "2", name: "Work", color: "#EF4444", taskCount: 8 },
  { id: "3", name: "Shopping", color: "#10B981", taskCount: 5 },
  { id: "4", name: "Health", color: "#F59E0B", taskCount: 3 },
]

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "COMPLETED project proposal",
    description: "Finish the Q4 project proposal for the new client",
    status: "IN_PROGRESS",
    priority: "HIGH",
    dueDate: new Date("2024-02-15"),
    tags: ["urgent", "client"],
    folderId: "2",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "2",
    title: "Buy groceries",
    description: "Milk, bread, eggs, and vegetables",
    status: "PENDING",
    priority: "MEDIUM",
    dueDate: new Date("2024-02-10"),
    tags: ["shopping", "weekly"],
    folderId: "3",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08"),
  },
  {
    id: "3",
    title: "Schedule dentist appointment",
    description: "Annual checkup and cleaning",
    status: "PENDING",
    priority: "LOW",
    dueDate: new Date("2024-02-20"),
    tags: ["health", "appointment"],
    folderId: "4",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: "4",
    title: "Read new book",
    description: 'Finish reading "The Productivity Method"',
    status: "COMPLETED",
    priority: "LOW",
    dueDate: new Date("2024-01-30"),
    tags: ["personal", "learning"],
    folderId: "1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-28"),
  },
  {
    id: "5",
    title: "Team meeting preparation",
    description: "Prepare slides and agenda for weekly team sync",
    status: "PENDING",
    priority: "HIGH",
    dueDate: new Date("2024-02-08"),
    tags: ["work", "meeting"],
    folderId: "2",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
]
