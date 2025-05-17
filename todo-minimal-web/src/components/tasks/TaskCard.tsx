
import { Task } from '@/types';
import { useTasks } from '@/contexts/TasksContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircleCheck, CircleX, Clock, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { useRef } from 'react';

interface TaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
}

const TaskCard = ({ task, onTaskClick }: TaskCardProps) => {
  const { deleteTask } = useTasks();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
    
    setTimeout(() => {
      cardRef.current?.classList.add('dragging');
    }, 0);
  };

  const handleDragEnd = () => {
    cardRef.current?.classList.remove('dragging');
  };

  // Status indicator
  const renderStatusIndicator = () => {
    switch (task.status) {
      case 'done':
        return <CircleCheck className="h-4 w-4 text-green-500" />;
      case 'overdue':
        return <CircleX className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Task card border style
  const getCardStyle = () => {
    switch (task.status) {
      case 'done':
        return 'border-green-200 bg-green-50 dark:bg-green-950/20';
      case 'overdue':
        return 'border-red-200 bg-red-50 dark:bg-red-950/20';
      default:
        return 'border-gray-200 bg-white dark:bg-gray-950/20';
    }
  };

  return (
    <Card 
      ref={cardRef}
      className={`task-card mb-3 cursor-pointer hover:shadow-md transition-shadow ${getCardStyle()}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onTaskClick(task)}
    >
      <CardContent className="p-3 pt-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {renderStatusIndicator()}
              <h3 className="font-medium">{task.title}</h3>
            </div>
            
            {task.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{task.description}</p>
            )}
            
            {task.expectedCompletionDate && (
              <div className="mt-2 text-xs text-muted-foreground">
                Due: {format(new Date(task.expectedCompletionDate), "MMM d, yyyy")}
              </div>
            )}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={(e) => e.stopPropagation()} // Prevent the card click event
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Task</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this task? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteTask(task.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
