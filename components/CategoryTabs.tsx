import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTasks } from "@/lib/data";
import { useRouter } from "next/navigation";

const CategoryTabs = ({ sortBy }: { sortBy: string }) => {
  const router = useRouter();
  return (
    <TabsList className="w-fit">
      <TabsTrigger
        onClick={() => router.push(`?status=OPEN&sortBy=${sortBy}`)}
        value="OPEN"
      >
        Open ({getTasks("OPEN").length})
      </TabsTrigger>
      <TabsTrigger
        onClick={() => router.push(`?status=IN_PROGRESS&sortBy=${sortBy}`)}
        value="IN_PROGRESS"
      >
        In Progress ({getTasks("IN_PROGRESS").length})
      </TabsTrigger>
      <TabsTrigger
        onClick={() => router.push(`?status=CLOSED&sortBy=${sortBy}`)}
        value="CLOSED"
      >
        Closed ({getTasks("CLOSED").length})
      </TabsTrigger>
    </TabsList>
  );
};

export default CategoryTabs;
