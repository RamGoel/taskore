import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAppState } from "@/store/useAppState";

const TaskDialog = () => {
  const { activeTask, isTaskDialogOpen } = useAppState();
  return (
    <Dialog
      open={isTaskDialogOpen}
      onOpenChange={(open) => {
        if (!open) {
          useAppState.setState({ activeTask: null, isTaskDialogOpen: false });
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{activeTask?.name}</DialogTitle>
          <DialogDescription>{activeTask?.comment}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
