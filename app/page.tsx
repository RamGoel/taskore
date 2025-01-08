"use client";
import TaskDialog from "@/components/TaskDialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import TasksView from "@/components/TaskView";
import { useMemo } from "react";
import moment from "moment";
import CategoryTabs from "@/components/CategoryTabs";
import GlobalFilters from "@/components/GlobalFilters";
import { useAppState } from "@/store/useAppState";

export default function Home() {
  const searchParams = useSearchParams();
  const status = (searchParams.get("status") ?? "OPEN") as string;
  const sortBy = (searchParams.get("sortBy") ?? "created_at") as string;
  const search = (searchParams.get("search") ?? "") as string;
  const { allTasks } = useAppState();

  const tasksToRender = useMemo(() => {
    const tasksInView = allTasks.filter((task) => task.status === status);
    return tasksInView
      .sort((a, b) => {
        if (sortBy === "due_date") {
          return moment(b.due_date).diff(moment(a.due_date));
        }
        return moment(b.created_at).diff(moment(a.created_at));
      })
      .filter((task) => {
        return task.name.toLowerCase().startsWith(search.toLowerCase());
      });
  }, [status, sortBy, search, allTasks]);

  const handleNavigate = (
    _path: string,
    _sortBy: string,
    _search: string,
    _status: string
  ) => {
    history.replaceState(
      null,
      "",
      `${_path}?status=${_status}&sortBy=${_sortBy}&search=${_search.replace(
        " ",
        "%20"
      )}`
    );
  };

  return (
    <div className="min-h-screen w-full p-6 bg-background ">
      <TaskDialog />
      <Tabs
        defaultValue={status || "OPEN"}
        className="w-full flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <CategoryTabs
            handleNavigate={(status) =>
              handleNavigate("/", sortBy, search, status)
            }
          />
          <GlobalFilters
            sortBy={sortBy}
            search={search}
            handleNavigate={(_sortBy, _search) =>
              handleNavigate("/", _sortBy, _search, status)
            }
          />
        </div>
        <TabsContent value={status}>
          <TasksView tasks={tasksToRender} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

