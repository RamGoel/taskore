"use client";
import PriorityBadge from "@/components/PriorityBadge";
import StatusBadge from "@/components/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { TableHeader } from "@/components/ui/table";
import { TaskPriority } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Task, useAppState } from "@/store/useAppState";
import moment from "moment";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

const TasksView = ({ tasks }: { tasks: Task[] }) => {
  const [selectedRow, setSelectedRow] = useState<number>(-1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        setSelectedRow((prev) => (prev === -1 ? tasks.length - 1 : prev - 1));
      } else if (e.key === "ArrowDown") {
        setSelectedRow((prev) => (prev === tasks.length - 1 ? 0 : prev + 1));
      } else if (e.key === "Enter" && selectedRow !== -1) {
        e.preventDefault();
        useAppState.setState({
          activeTask: tasks[selectedRow],
          isTaskDialogOpen: true,
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tasks, selectedRow]);

  return (
    <Table className="focus:outline-none">
      <TableHeader>
        <TableRow>
          <TableHead>S.No</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead className="hidden md:table-cell">Labels</TableHead>
          <TableHead className="hidden md:table-cell">Assignee</TableHead>
          <TableHead className="hidden lg:table-cell">Due Date</TableHead>
          <TableHead className="hidden lg:table-cell">Created</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {tasks.length === 0
          ? Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index} className="h-[60px]">
                <TableCell className="flex items-center justify-center">
                  <Skeleton className="h-9 w-full" />
                </TableCell>
              </TableRow>
            ))
          : tasks.map((task, index) => (
              <TableRow
                onClick={() =>
                  useAppState.setState({
                    activeTask: task,
                    isTaskDialogOpen: true,
                  })
                }
                key={task.id}
                className={cn("h-[60px] cursor-pointer", {
                  "bg-accent": selectedRow === index,
                })}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {task.name} (#{task.id})
                </TableCell>
                <TableCell>
                  <PriorityBadge status={task.priority as TaskPriority} />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-2">
                    {task.labels.map((label) => (
                      <StatusBadge key={label} label={label} />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {task.assignee}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {moment(task.due_date).format("DD MMM, YYYY hh:mma")}
                </TableCell>
                <TableCell
                  className="hidden lg:table-cell"
                  title={moment(task.created_at).format("DD/MM/YYYY hh:mm:ss")}
                >
                  {moment(task.created_at).format("DD/MM/YYYY hh:mma")}
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
};

export default TasksView;
