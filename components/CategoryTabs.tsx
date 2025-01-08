import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppState } from "@/store/useAppState";

const CategoryTabs = ({
  handleNavigate,
}: {
  handleNavigate: (status: string) => void;
}) => {
  const { allTasks } = useAppState();
  return (
    <TabsList className="w-fit">
      <TabsTrigger onClick={() => handleNavigate("OPEN")} value="OPEN">
        Open ({allTasks.filter((task) => task.status === "OPEN").length})
      </TabsTrigger>
      <TabsTrigger
        onClick={() => handleNavigate("IN_PROGRESS")}
        value="IN_PROGRESS"
      >
        In Progress (
        {allTasks.filter((task) => task.status === "IN_PROGRESS").length})
      </TabsTrigger>
      <TabsTrigger onClick={() => handleNavigate("CLOSED")} value="CLOSED">
        Closed ({allTasks.filter((task) => task.status === "CLOSED").length})
      </TabsTrigger>
    </TabsList>
  );
};

export default CategoryTabs;
