
import { Task } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CircleCheck, CircleX, Pencil, Clock } from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

const TaskDetailModal = ({ task, isOpen, onClose, onEdit }: TaskDetailModalProps) => {
  if (!task) return null;

  const createdAt = new Date(task.createdAt);
  const formattedCreatedAt = format(createdAt, "PPP");
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });
  
  let statusIcon;
  let statusColor;
  
  switch (task.status) {
    case 'done':
      statusIcon = <CircleCheck className="h-6 w-6 text-green-500" />;
      statusColor = "text-green-600";
      break;
    case 'overdue':
      statusIcon = <CircleX className="h-6 w-6 text-red-500" />;
      statusColor = "text-red-600";
      break;
    default:
      statusIcon = <Clock className="h-6 w-6 text-muted-foreground" />;
      statusColor = "text-muted-foreground";
  }
  
  // Format expected completion date if it exists
  let formattedExpectedDate = "Not set";
  let isOverdue = false;
  
  if (task.expectedCompletionDate) {
    const expectedDate = new Date(task.expectedCompletionDate);
    formattedExpectedDate = format(expectedDate, "PPP");
    
    // Check if task is overdue
    if (task.status !== 'done') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      isOverdue = expectedDate < today;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex-1">
            <DialogTitle className="text-xl">{task.title}</DialogTitle>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onEdit}
              className="h-8 w-8"
              title="Edit task"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <div className="flex items-center">
              {statusIcon}
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 pt-2">
          {/* Description Section */}
          {task.description && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Description</h4>
              <p className="text-sm">{task.description}</p>
            </div>
          )}
          
          {/* Details Grid */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Details</h4>
            <div className="grid grid-cols-2 gap-y-2 text-sm rounded-md border p-3 bg-muted/30">
              <div className="text-muted-foreground">Status:</div>
              <div className={`font-medium capitalize ${statusColor}`}>
                {task.status}
              </div>
              
              <div className="text-muted-foreground">Created:</div>
              <div className="font-medium">
                {formattedCreatedAt}
                <span className="ml-1 text-xs text-muted-foreground block sm:inline">{timeAgo}</span>
              </div>
              
              <div className="text-muted-foreground">Expected completion:</div>
              <div className={`font-medium ${isOverdue && task.status !== 'done' ? 'text-red-500' : ''}`}>
                {formattedExpectedDate}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;
