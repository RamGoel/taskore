import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTasks } from "@/lib/data";

const CategoryTabs = ({
  handleNavigate,
}: {
  handleNavigate: (status: string) => void;
}) => {
  return (
    <TabsList className="w-fit">
      <TabsTrigger onClick={() => handleNavigate("OPEN")} value="OPEN">
        Open ({getTasks("OPEN").length})
      </TabsTrigger>
      <TabsTrigger
        onClick={() => handleNavigate("IN_PROGRESS")}
        value="IN_PROGRESS"
      >
        In Progress ({getTasks("IN_PROGRESS").length})
      </TabsTrigger>
      <TabsTrigger onClick={() => handleNavigate("CLOSED")} value="CLOSED">
        Closed ({getTasks("CLOSED").length})
      </TabsTrigger>
    </TabsList>
  );
};

export default CategoryTabs;
