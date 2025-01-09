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
import { ArrowUpDown, PaintBucketIcon } from "lucide-react";
import { Button } from "./ui/button";

const TasksView = ({ tasks }: { tasks: Task[] }) => {
  const [selectedRow, setSelectedRow] = useState<number>(-1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Task | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });
  const { isLoading } = useAppState();

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "string" && typeof bValue === "string") {
      if (sortConfig.key === "due_date" || sortConfig.key === "created_at") {
        return sortConfig.direction === "asc"
          ? moment(aValue).diff(moment(bValue))
          : moment(bValue).diff(moment(aValue));
      }
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });

  const requestSort = (key: keyof Task) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        setSelectedRow((prev) =>
          prev === -1 ? sortedTasks.length - 1 : prev - 1
        );
      } else if (e.key === "ArrowDown") {
        setSelectedRow((prev) =>
          prev === sortedTasks.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === "Enter" && selectedRow !== -1) {
        e.preventDefault();
        useAppState.setState({
          activeTask: sortedTasks[selectedRow],
          isTaskDialogOpen: true,
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sortedTasks, selectedRow]);

  const SortableHeader = ({
    column,
    label,
  }: {
    column: keyof Task;
    label: string;
  }) => (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => requestSort(column)}
        className="h-8 flex items-center gap-1"
      >
        {label}
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    </TableHead>
  );

  if (!isLoading && sortedTasks.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-muted-foreground flex items-center gap-2">
          <PaintBucketIcon strokeWidth={1.5} className="h-5 w-5" /> No tasks
          found :/
        </p>
      </div>
    );
  }

  return (
    <Table className="focus:outline-none">
      <TableHeader>
        <TableRow>
          <TableHead>S.No</TableHead>
          <SortableHeader column="name" label="Name" />
          <SortableHeader column="priority" label="Priority" />
          <TableHead className="hidden md:table-cell">Labels</TableHead>
          <SortableHeader column="assignee" label="Assignee" />
          <TableHead className="hidden lg:table-cell">
            <Button
              variant="ghost"
              onClick={() => requestSort("due_date")}
              className="h-8 flex items-center gap-1"
            >
              Due Date
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead className="hidden lg:table-cell">
            <Button
              variant="ghost"
              onClick={() => requestSort("created_at")}
              className="h-8 flex items-center gap-1"
            >
              Created
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {sortedTasks.length === 0 && isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index} className="h-[60px]">
                <TableCell className="flex items-center justify-center">
                  <Skeleton className="h-9 w-full" />
                </TableCell>
              </TableRow>
            ))
          : sortedTasks.map((task, index) => (
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
