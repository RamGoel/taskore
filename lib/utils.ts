import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleNavigate = (
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
