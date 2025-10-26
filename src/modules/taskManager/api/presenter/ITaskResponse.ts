export interface ITaskResponse {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string; // ISO date string from JSON serialization
}
