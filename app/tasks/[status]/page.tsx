import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Table } from "@/components/ui/table";
import { tasks } from "@/lib/data";
import { TaskPriority } from "@/lib/types";
import moment from "moment";
import StatusBadge from "@/components/StatusBadge";
import PriorityBadge from "@/components/PriorityBadge";

const TaskPage = async ({ params }: { params: { status: string } }) => {
  const { status } = await params;
  const formattedStatus = status?.replace("-", "_")?.toUpperCase();
  const tasks = await getTasks(formattedStatus);
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
          {tasks.map((task) => (
            <TableRow key={task.id} className="h-[60px] cursor-pointer">
              <TableCell>{task.id}</TableCell>
              <TableCell>{task.name}</TableCell>
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

const getTasks = async (status: string) => {
  const filteredTasks = tasks.filter((task) => task.status === status);
  return filteredTasks;
};

export default TaskPage;
