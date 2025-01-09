"use client";
import TaskDialog from "@/components/TaskDialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import TasksView from "@/components/TaskView";
import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import CategoryTabs from "@/components/CategoryTabs";
import GlobalFilters from "@/components/GlobalFilters";
import { useAppState } from "@/store/useAppState";
import { handleNavigate } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";

const TASKS_PER_PAGE = 13;

export default function MainComponent() {
  const searchParams = useSearchParams();
  const status = (searchParams.get("status") ?? "OPEN") as string;
  const sortBy = (searchParams.get("sortBy") ?? "created_at") as string;
  const search = (searchParams.get("search") ?? "") as string;
  const { allTasks, fetchTasks } = useAppState();
  const [visibleCount, setVisibleCount] = useState(TASKS_PER_PAGE);
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (inView) {
      setTimeout(() => {
        setVisibleCount((prev) => prev + TASKS_PER_PAGE);
      }, 1500);
    }
  }, [inView]);

  const tasksToRender = useMemo(() => {
    if (!allTasks) return [];
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

  const visibleTasks = tasksToRender.slice(0, visibleCount);
  const hasMore = visibleTasks.length < tasksToRender.length;

  return (
    <div className="min-h-screen w-full p-6 bg-background ">
      <TaskDialog tasks={tasksToRender} />
      <Tabs
        defaultValue={status || "OPEN"}
        className="w-full flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <CategoryTabs
            handleNavigate={(status) => {
              handleNavigate("/", sortBy, search, status);
              setVisibleCount(TASKS_PER_PAGE); // Reset visible count when navigating to a new status
            }}
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
          <TasksView tasks={visibleTasks} />
          {hasMore && (
            <div
              ref={ref}
              className="h-10 flex items-center gap-2 justify-center"
            >
              <Loader2 className="animate-spin" /> <p>Loading more tasks...</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
