import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const GlobalFilters = ({
  search,
  status,
  sortBy,
  setSearchValue,
}: {
  status: string;
  sortBy: string;
  search: string;
  setSearchValue: (value: string) => void;
}) => {
  const router = useRouter();
  return (
    <div className="w-full max-w-md flex items-center gap-2">
      <div className="relative">
        <Input
          placeholder="Search"
          value={search || ""}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
        <X
          onClick={() => {
            setSearchValue("");
          }}
          className="w-4 h-4 absolute right-2 opacity-50 hover:opacity-100 cursor-pointer top-1/2 -translate-y-1/2"
        />
      </div>
      <Select
        onValueChange={(value) =>
          router.push(`?status=${status}&sortBy=${value}`)
        }
        defaultValue={sortBy}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="due_date">Due Date</SelectItem>
          <SelectItem value="created_at">Created At</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default GlobalFilters;
