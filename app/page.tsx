"use client";
import TaskDialog from "@/components/TaskDialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { getTasks } from "@/lib/data";
import { useRouter, useSearchParams } from "next/navigation";
import TasksView from "@/components/TaskView";
import { useMemo } from "react";
import moment from "moment";
import CategoryTabs from "@/components/CategoryTabs";
import GlobalFilters from "@/components/GlobalFilters";

export default function Home() {
  const searchParams = useSearchParams();
  const status = (searchParams.get("status") ?? "OPEN") as string;
  const sortBy = (searchParams.get("sortBy") ?? "created_at") as string;
  const search = (searchParams.get("search") ?? "") as string;

  const tasksToRender = useMemo(() => {
    return getTasks(status)
      .sort((a, b) => {
        if (sortBy === "due_date") {
          return moment(b.due_date).diff(moment(a.due_date));
        }
        return moment(b.created_at).diff(moment(a.created_at));
      })
      .filter((task) => {
        return task.name.toLowerCase().includes(search.toLowerCase());
      });
  }, [status, sortBy, search]);

  return (
    <div className="min-h-screen w-full p-6 bg-background ">
      <TaskDialog />
      <Tabs
        defaultValue={status || "OPEN"}
        className="w-full flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <CategoryTabs sortBy={sortBy} />
          <GlobalFilters
            status={status}
            sortBy={sortBy}
            search={search}
            setSearchValue={(value) => {
              if (value === "") {
                history.replaceState(
                  null,
                  "",
                  `/?status=${status}&sortBy=${sortBy}`
                );
              } else {
                history.replaceState(
                  null,
                  "",
                  `/?status=${status}&sortBy=${sortBy}&search=${value}`
                );
              }
            }}
          />
        </div>
        <TabsContent value={status}>
          <TasksView tasks={tasksToRender} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

