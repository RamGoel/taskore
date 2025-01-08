import { useTasks } from "@/store/useTasks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskPriority, TaskStatus } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useEffect, useState } from "react";
import moment from "moment";
import { ArrowDown, ArrowUp, RefreshCcw } from "lucide-react";

const TaskCategories = () => {
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
          <TabsTrigger value="OPEN">
            Open ({String(taskCounts.OPEN)})
          </TabsTrigger>
          <TabsTrigger
            disabled={taskCounts.IN_PROGRESS === 0}
            value="IN_PROGRESS"
          >
            In Progress ({String(taskCounts.IN_PROGRESS)})
          </TabsTrigger>
          <TabsTrigger disabled={taskCounts.CLOSED === 0} value="CLOSED">
            Closed ({String(taskCounts.CLOSED)})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="OPEN">
          <TaskView type="OPEN" />
        </TabsContent>
        <TabsContent value="IN_PROGRESS">
          <TaskView type="IN_PROGRESS" />
        </TabsContent>
        <TabsContent value="CLOSED">
          <TaskView type="CLOSED" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const TaskView = ({ type }: { type: TaskStatus }) => {
  const { tasks } = useTasks();
  const tasksByStatus = tasks.filter((task) => task.status === type);
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="hidden md:table-cell">Labels</TableHead>
            <TableHead className="hidden md:table-cell">Assignee</TableHead>
            <TableHead className="hidden lg:table-cell">Due Date</TableHead>
            <TableHead className="hidden lg:table-cell">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasksByStatus.map((task) => (
            <TableRow key={task.id} className="h-[60px] cursor-pointer">
              <TableCell>{task.id}</TableCell>
              <TableCell>{task.name}</TableCell>
              <TableCell>
                <PriorityBadge status={task.priority as TaskPriority} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex flex-wrap gap-2">
                  {task.labels.map((label) => (
                    <CustomBadge key={label} label={label} />
                  ))}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {task.assignee}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {moment(task.due_date).format("DD MMM, YYYY")}
              </TableCell>
              <TableCell
                className="hidden lg:table-cell"
                title={moment(task.created_at).format("DD/MM/YYYY hh:mm:ss")}
              >
                {moment(task.created_at).fromNow()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const CustomBadge = ({ label }: { label: string }) => {
  const RANDOM_COLOR_CLASSES = [
    "bg-green-500/30 text-green-500 border border-green-500",
    "bg-blue-500/30 text-blue-500 border border-blue-500",
    "bg-red-500/30 text-red-500 border border-red-500",
    "bg-yellow-500/30 text-yellow-500 border border-yellow-500",
    "bg-purple-500/30 text-purple-500 border border-purple-500",
    "bg-pink-500/30 text-pink-500 border border-pink-500",
  ];
  const randomColor =
    RANDOM_COLOR_CLASSES[
      Math.floor(Math.random() * RANDOM_COLOR_CLASSES.length)
    ];
  return (
    <p
      className={`text-xs font-medium ${randomColor} text-primary-foreground px-2 py-1 rounded-full w-fit`}
    >
      {label}
    </p>
  );
};

const PriorityBadge = ({ status }: { status: TaskPriority }) => {
  const statusColor = {
    HIGH: "bg-red-500/30 text-red-500 border border-red-500",
    MEDIUM: "bg-yellow-500/30 text-yellow-500 border border-yellow-500",
    LOW: "bg-green-500/30 text-green-500 border border-green-500",
  };

  const priorityIcons = {
    HIGH: <ArrowUp className="w-4 h-4" />,
    MEDIUM: <RefreshCcw className="w-4 h-4" />,
    LOW: <ArrowDown className="w-4 h-4" />,
  };

  return (
    <div
      className={`text-xs font-medium ${statusColor[status]} text-primary-foreground px-2 py-1 rounded-full w-fit flex items-center gap-2`}
    >
      {priorityIcons[status]}
      {status}
    </div>
  );
};

export default TaskCategories;
