import React from 'react';
import { Assignee } from './types';

interface GanttSidebarProps {
  assignees: Assignee[];
}

const GanttSidebar: React.FC<GanttSidebarProps> = ({ assignees }) => {
  return (
    <div className="gantt-sidebar">
      <div className="gantt-sidebar-header">担当者</div>
      {assignees.map(assignee => (
        <div key={assignee.id} className="gantt-sidebar-row">
          {assignee.name}
        </div>
      ))}
    </div>
  );
};

export default GanttSidebar;
