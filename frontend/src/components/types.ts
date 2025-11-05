export interface Task {
  id: string;
  name: string;
  assigneeId: string;
  startDate: Date;
  endDate: Date;
}

export interface Assignee {
  id: string;
  name: string;
}
