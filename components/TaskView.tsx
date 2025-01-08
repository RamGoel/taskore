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

const TasksView = ({ tasks }: { tasks: Task[] }) => {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        setSelectedRow((prev) =>
          prev === null
            ? tasks.length - 1
            : prev === 0
            ? tasks.length - 1
            : prev - 1
        );
      } else if (e.key === "ArrowDown") {
        setSelectedRow((prev) =>
          prev === null ? 0 : prev === tasks.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedRow !== null) {
          useAppState.setState({
            activeTask: tasks.find((task) => task.id === selectedRow),
            isTaskDialogOpen: true,
          });
        } else {
          useAppState.setState({
            activeTask: tasks[0],
            isTaskDialogOpen: true,
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tasks.length, tasks, selectedRow]);

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
        {tasks.map((task, index) => (
          <TableRow
            onClick={() =>
              useAppState.setState({
                activeTask: task,
                isTaskDialogOpen: true,
              })
            }
            key={task.id}
            className={cn("h-[60px] cursor-pointer", {
              "bg-accent": selectedRow === task.id,
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
