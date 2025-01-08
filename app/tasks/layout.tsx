import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tasks } from "@/lib/data";
import { TaskStatus } from "@/lib/types";
import Link from "next/link";

const TaskLayout = async ({ children }: { children: React.ReactNode }) => {
  const taskCounts = await getTaskCounts();
  return (
    <div className="min-h-screen w-full p-6 bg-background ">
      <Tabs defaultValue="OPEN" className="w-full flex flex-col gap-4">
        <TabsList className="w-fit">
          <Link href="/tasks/open">
            <TabsTrigger value="OPEN">Open ({taskCounts.OPEN})</TabsTrigger>
          </Link>
          <Link href="/tasks/in-progress">
            <TabsTrigger value="IN_PROGRESS">
              In Progress ({taskCounts.IN_PROGRESS})
            </TabsTrigger>
          </Link>
          <Link href="/tasks/closed">
            <TabsTrigger value="CLOSED">
              Closed ({taskCounts.CLOSED})
            </TabsTrigger>
          </Link>
        </TabsList>
        {children}
      </Tabs>
    </div>
  );
};

const getTaskCounts = async () => {
  const taskCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status as TaskStatus] = acc[task.status as TaskStatus] + 1;
      return acc;
    },
    { OPEN: 0, IN_PROGRESS: 0, CLOSED: 0 } as Record<TaskStatus, number>
  );
  return taskCounts;
};

export default TaskLayout;
