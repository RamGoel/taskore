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

const TaskDialog = ({ tasks }: { tasks: Task[] }) => {
  const { activeTask, isTaskDialogOpen } = useAppState();
  const [newStatus, setNewStatus] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const { allTasks, setAllTasks, setActiveTask, setIsTaskDialogOpen } =
    useAppState();

  useEffect(() => {
    if (activeTask) {
      setComment(activeTask.comment);
    }
  }, [activeTask]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isTaskDialogOpen) return;

      const sameStatusTasks = tasks;

      if (e.key === "ArrowRight") {
        const currentIndex = sameStatusTasks.findIndex(
          (task) => task.id === activeTask?.id
        );
        const nextIndex = (currentIndex + 1) % sameStatusTasks.length;
        setActiveTask(sameStatusTasks[nextIndex]);
      } else if (e.key === "ArrowLeft") {
        const currentIndex = sameStatusTasks.findIndex(
          (task) => task.id === activeTask?.id
        );
        const prevIndex =
          currentIndex === 0 ? sameStatusTasks.length - 1 : currentIndex - 1;
        setActiveTask(sameStatusTasks[prevIndex]);
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
  }, [isTaskDialogOpen, activeTask, allTasks, setActiveTask]);

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
                <p className="text-sm flex-1 whitespace-nowrap font-medium">
                  Change Status:
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
          <hr className="" />
          <DialogFooter>
            <div className="flex items-center justify-between gap-2 w-full">
              <p className="text-sm text-muted-foreground">
                1, 2, 3 to change status, {"<- ->"} to navigate
              </p>
              <Button onClick={handleClose}>Close</Button>
            </div>
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
