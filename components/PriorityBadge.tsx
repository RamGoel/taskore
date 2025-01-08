import { TaskPriority } from "@/lib/types";
import { ArrowDown, RefreshCcw, ArrowUp } from "lucide-react";

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
      className={`text-xs font-medium ${statusColor[status]} px-2 py-1 rounded-full w-fit flex items-center gap-2`}
    >
      {priorityIcons[status]}
      {status}
    </div>
  );
};

export default PriorityBadge;
