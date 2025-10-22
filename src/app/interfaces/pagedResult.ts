import { Task } from "./Task";

export interface PagedResult {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  todos: Task[];
}