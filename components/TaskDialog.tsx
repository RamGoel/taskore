import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Task, useAppState } from "@/store/useAppState";
import PriorityBadge from "./PriorityBadge";
import { TaskPriority } from "@/lib/types";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { MessageSquare } from "lucide-react";

const TaskDialog = () => {
  const { activeTask, isTaskDialogOpen } = useAppState();
  const [newStatus, setNewStatus] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const { allTasks, setAllTasks, setActiveTask, setIsTaskDialogOpen } =
    useAppState();
  const [tasksInView, setTasksInView] = useState<Task[]>(
    allTasks.filter((task) => task.status === activeTask?.status)
  );

  useEffect(() => {
    if (activeTask) {
      setTasksInView(
        allTasks.filter((task) => task.status === activeTask.status)
      );
      setCurrentTaskIndex(
        tasksInView.findIndex((task) => task.id === activeTask.id)
      );
      setComment(activeTask.comment);
    }
  }, [activeTask, allTasks]);

  useEffect(() => {
    setTasksInView(
      allTasks.filter((task) => task.status === activeTask?.status)
    );
  }, [activeTask, allTasks]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isTaskDialogOpen) return;

      if (e.key === "ArrowRight") {
        const nextIndex = (currentTaskIndex + 1) % tasksInView.length;
        useAppState.setState({ activeTask: tasksInView[nextIndex] });
      } else if (e.key === "ArrowLeft") {
        const prevIndex =
          currentTaskIndex === 0
            ? tasksInView.length - 1
            : currentTaskIndex - 1;
        useAppState.setState({ activeTask: tasksInView[prevIndex] });
      } else if (e.key >= "1" && e.key <= "3") {
        const statusMap = {
          "1": "OPEN",
          "2": "IN_PROGRESS",
          "3": "CLOSED",
        };
        setNewStatus(statusMap[e.key as keyof typeof statusMap]);
        setShowCommentDialog(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTaskDialogOpen, currentTaskIndex, tasksInView]);

  const handleStatusChange = (status: string) => {
    setNewStatus(status);
    setShowCommentDialog(true);
  };

  const handleStatusUpdate = () => {
    if (!comment.trim()) return;

    const updatedTask = {
      ...activeTask!,
      status: newStatus!,
      comment: comment,
      updated_at: new Date().toISOString(),
    };

    const updatedTasks = allTasks.map((task) =>
      task.id === activeTask?.id ? updatedTask : task
    );

    setAllTasks(updatedTasks);
    setActiveTask(null);
    setIsTaskDialogOpen(false);
    setShowCommentDialog(false);
    setNewStatus(null);
  };

  const handleClose = () => {
    setActiveTask(null);
    setIsTaskDialogOpen(false);
    setShowCommentDialog(false);
    setNewStatus(null);
  };

  return (
    <>
      <Dialog open={isTaskDialogOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeTask?.name}</DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-md">
              <MessageSquare className="w-4 h-4" /> {activeTask?.comment}
            </DialogDescription>
            <div className="flex items-center gap-2 justify-between">
              <p className="text-sm text-muted-foreground">
                Assigned to: {activeTask?.assignee}
              </p>
              <PriorityBadge status={activeTask?.priority as TaskPriority} />
            </div>
          </DialogHeader>
          <div>
            <div className="flex items-center gap-2">
              <div className="flex flex-1 flex-col">
                <p className="text-md flex-1 whitespace-nowrap font-medium">
                  Change Status
                </p>
                <p className="text-sm text-muted-foreground">
                  1: Open, 2: In Progress, 3: Closed
                </p>
              </div>
              <Select
                value={activeTask?.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-[180px] focus:outline-none">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status Comment</DialogTitle>
            <DialogDescription>
              Please provide a comment for this status change
            </DialogDescription>
          </DialogHeader>
          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter comment..."
            autoFocus
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCommentDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} disabled={!comment.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskDialog;
