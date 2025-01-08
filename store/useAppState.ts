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
}

export const useAppState = create<AppState>()((set) => ({
  activeTask: null,
  isTaskDialogOpen: false,
}));
