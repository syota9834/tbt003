export interface Task {
  id: number;
  name: string | null;
  assigneeId: number;
  startDate: string; // ISO 8601 string
  endDate: string;   // ISO 8601 string
  DeleteFlg: boolean;
}

export interface Assignee {
  id: number;
  name: string | null;
  DeleteFlg: boolean;
}
