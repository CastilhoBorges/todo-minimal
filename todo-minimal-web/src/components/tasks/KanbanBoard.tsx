
import { useState } from 'react';
import { useTasks } from '@/contexts/TasksContext';
import TaskColumn from './TaskColumn';
import TaskFormModal from './TaskFormModal';
import TaskDetailModal from './TaskDetailModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Task } from '@/types';

const KanbanBoard = () => {
  const { tasks, isLoading, moveTask } = useTasks();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const overdueTasks = tasks.filter(task => task.status === 'overdue');
  const doneTasks = tasks.filter(task => task.status === 'done');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: 'todo' | 'done' | 'overdue') => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      moveTask(taskId, status);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditMode(false);
  };

  const handleEditTask = () => {
    setIsEditMode(true);
  };

  const closeTaskDetailModal = () => {
    setSelectedTask(null);
    setIsEditMode(false);
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Your Tasks</h2>
        <Button onClick={() => setIsTaskModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <TaskColumn
          title="To Do"
          tasks={todoTasks}
          status="todo"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'todo')}
          onTaskClick={handleTaskClick}
        />
        <TaskColumn
          title="Overdue"
          tasks={overdueTasks}
          status="overdue"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'overdue')}
          onTaskClick={handleTaskClick}
        />
        <TaskColumn
          title="Done"
          tasks={doneTasks}
          status="done"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'done')}
          onTaskClick={handleTaskClick}
        />
      </div>
      
      {/* Regular task creation modal */}
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />

      {/* Conditionally render either the detail modal or the edit modal */}
      {selectedTask && !isEditMode && (
        <TaskDetailModal 
          task={selectedTask}
          isOpen={selectedTask !== null}
          onClose={closeTaskDetailModal}
          onEdit={handleEditTask}
        />
      )}
      
      {/* Edit task modal */}
      {selectedTask && isEditMode && (
        <TaskFormModal
          isOpen={true}
          onClose={closeTaskDetailModal}
          existingTask={{
            id: selectedTask.id,
            title: selectedTask.title,
            description: selectedTask.description,
            status: selectedTask.status,
            expectedCompletionDate: selectedTask.expectedCompletionDate ? new Date(selectedTask.expectedCompletionDate) : undefined,
          }}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
