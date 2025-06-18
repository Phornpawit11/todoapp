export interface TodoListModel {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
  dueDate?: Date;
  priority?: "low" | "medium" | "high";
}
