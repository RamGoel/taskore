import { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskStatus } from "@/lib/types";
import { useTasks } from "@/store/useTasks";
import { useEffect } from "react";

const TaskLayout = ({ children }: { children: React.ReactNode }) => {
  const { tasks } = useTasks();
  const [taskCounts, setTaskCounts] = useState<Record<TaskStatus, number>>();

  useEffect(() => {
    const counts = tasks.reduce(
      (acc, task) => {
        acc[task.status as TaskStatus] = acc[task.status as TaskStatus] + 1;
        return acc;
      },
      { OPEN: 0, IN_PROGRESS: 0, CLOSED: 0 } as Record<TaskStatus, number>
    );
    setTaskCounts(counts);
  }, [tasks]);

  if (!taskCounts) return null;

  return (
    <div className="min-h-screen w-full p-6 bg-background ">
      <Tabs defaultValue="OPEN" className="w-full flex flex-col gap-4">
        <TabsList className="w-fit">
          <TabsTrigger value="OPEN">Open</TabsTrigger>
          <TabsTrigger value="IN_PROGRESS">In Progress</TabsTrigger>
          <TabsTrigger value="CLOSED">Closed</TabsTrigger>
        </TabsList>
        {children}
      </Tabs>
    </div>
  );
};

export default TaskLayout;
