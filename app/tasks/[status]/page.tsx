import { useTasks } from "@/store/useTasks";
import React from "react";

const TaskPage = ({ params }: { params: { status: string } }) => {
  const { status } = params;
  const { tasks } = useTasks();
  const filteredTasks = tasks.filter((task) => task.status === status);

  return <TaskTable tasks={filteredTasks} />;
};

export default TaskPage;
