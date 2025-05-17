import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Task, TasksContextType } from '@/types';
import tasksService from '@/services/tasks.service';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTasks = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTasks = await tasksService.getTasks(user.id);
      
      // Check for overdue tasks and ensure proper status typing
      const updatedTasks = fetchedTasks.map(task => {
        if (task.status === 'todo' && task.expectedCompletionDate) {
          const expectedDate = new Date(task.expectedCompletionDate);
          const today = new Date();
          // Remove time part for comparison
          today.setHours(0, 0, 0, 0);
          
          if (expectedDate < today) {
            return { ...task, status: 'overdue' as const };
          }
        }
        // Ensure proper typing for task.status
        return { 
          ...task,
          status: task.status as 'todo' | 'done' | 'overdue' 
        };
      });
      
      setTasks(updatedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    
    // Check for overdue tasks every hour
    const interval = setInterval(() => {
      if (tasks.length > 0) {
        const updatedTasks = tasks.map(task => {
          if (task.status === 'todo' && task.expectedCompletionDate) {
            const expectedDate = new Date(task.expectedCompletionDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (expectedDate < today) {
              return { ...task, status: 'overdue' as const };
            }
          }
          return task;
        });
        
        // Only update state if there are changes
        const hasChanges = updatedTasks.some(
          (task, i) => task.status !== tasks[i].status
        );
        
        if (hasChanges) {
          setTasks(updatedTasks);
        }
      }
    }, 3600000); // Check every hour
    
    return () => clearInterval(interval);
  }, [user]); // Remove 'tasks' from the dependency array to prevent infinite loop

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const newTask = await tasksService.createTask({
        ...taskData,
        userId: user.id
      });
      setTasks(prev => [...prev, newTask]);
      toast({
        title: "Task created",
        description: "Your task was created successfully",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedTask = await tasksService.updateTask(taskId, updates);
      setTasks(prev => prev.map(task => task.id === taskId ? updatedTask : task));
      toast({
        title: "Task updated",
        description: "Your task was updated successfully",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await tasksService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast({
        title: "Task deleted",
        description: "Your task was deleted successfully",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const moveTask = async (taskId: string, newStatus: 'todo' | 'done' | 'overdue') => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First update the local state for immediate feedback
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
      
      // Then update the backend
      await tasksService.updateTask(taskId, { status: newStatus });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move task');
      toast({
        title: "Error",
        description: "Failed to move task",
        variant: "destructive",
      });
      
      // Revert the local state change if the backend update failed
      fetchTasks();
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    isLoading,
    error,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
