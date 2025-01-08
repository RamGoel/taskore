import { tasks } from "@/lib/data";
import { create } from "zustand";

export interface Task {
  id: number;
  name: string;
  labels: string[];
  status: string;
  priority: string;
  assignee: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  comment: string;
}

interface AppState {
  activeTask: Task | null;
  isTaskDialogOpen: boolean;
  allTasks: Task[];
  setAllTasks: (tasks: Task[]) => void;
  setActiveTask: (task: Task | null) => void;
  setIsTaskDialogOpen: (open: boolean) => void;
}

export const useAppState = create<AppState>()((set) => ({
  activeTask: null,
  isTaskDialogOpen: false,
  allTasks: tasks,
  setAllTasks: (tasks) => set({ allTasks: tasks }),
  setActiveTask: (task) => set({ activeTask: task }),
  setIsTaskDialogOpen: (open) => set({ isTaskDialogOpen: open }),
}));
