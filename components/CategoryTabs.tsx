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
    <TabsList className="w-fit h-[40px]">
      <TabsTrigger
        className="h-[32px]"
        onClick={() => handleNavigate("OPEN")}
        value="OPEN"
      >
        Open ({allTasks.filter((task) => task.status === "OPEN").length})
      </TabsTrigger>
      <TabsTrigger
        className="h-[32px]"
        onClick={() => handleNavigate("IN_PROGRESS")}
        value="IN_PROGRESS"
      >
        In Progress (
        {allTasks.filter((task) => task.status === "IN_PROGRESS").length})
      </TabsTrigger>
      <TabsTrigger
        className="h-[32px]"
        onClick={() => handleNavigate("CLOSED")}
        value="CLOSED"
      >
        Closed ({allTasks.filter((task) => task.status === "CLOSED").length})
      </TabsTrigger>
    </TabsList>
  );
};

export default CategoryTabs;
