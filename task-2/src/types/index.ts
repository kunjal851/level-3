export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  deadline: string;
  assignee: string;
  createdAt: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  tasks: Task[];
  createdAt: string;
}
