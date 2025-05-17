
import TaskCard from './TaskCard';
import { Task } from '@/types';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: 'todo' | 'done' | 'overdue';
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onTaskClick: (task: Task) => void;
}

const TaskColumn = ({ 
  title, 
  tasks, 
  status, 
  onDragOver, 
  onDrop,
  onTaskClick
}: TaskColumnProps) => {
  // Set column style based on status
  const getColumnStyle = () => {
    switch (status) {
      case 'todo':
        return 'bg-gray-50 border border-gray-200';
      case 'overdue':
        return 'bg-red-50 border border-red-200';
      case 'done':
        return 'bg-green-50 border border-green-200';
      default:
        return 'bg-gray-50 border border-gray-200';
    }
  };
  
  return (
    <div
      className={`kanban-column rounded-lg p-4 ${getColumnStyle()}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-status={status}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">{title}</h3>
        <span className={`flex h-6 w-6 items-center justify-center rounded-full 
          ${status === 'overdue' ? 'bg-red-100 text-red-600' : 
            status === 'done' ? 'bg-green-100 text-green-600' : 
            'bg-primary/10 text-primary'} 
          text-xs font-medium`}>
          {tasks.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {tasks.length > 0 ? (
          tasks.map(task => <TaskCard key={task.id} task={task} onTaskClick={onTaskClick} />)
        ) : (
          <div className="flex h-24 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            No tasks yet
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
