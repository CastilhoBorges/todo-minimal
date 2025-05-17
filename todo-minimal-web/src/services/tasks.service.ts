
import { Task } from "@/types";

// This is a mock implementation. In a real app, this would connect to your backend.
class TasksService {
  private storageKey = 'todo_app_tasks';

  async getTasks(userId: string): Promise<Task[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get tasks from localStorage
    const tasksData = localStorage.getItem(this.storageKey);
    const tasks: Task[] = tasksData ? JSON.parse(tasksData) : [];
    
    // Return only tasks belonging to this user
    return tasks.filter(task => task.userId === userId);
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt'> & { userId: string }): Promise<Task> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get existing tasks
    const tasksData = localStorage.getItem(this.storageKey);
    const tasks: Task[] = tasksData ? JSON.parse(tasksData) : [];
    
    // Create new task with ID and timestamp
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    // Add to "database" (localStorage)
    const updatedTasks = [...tasks, newTask];
    localStorage.setItem(this.storageKey, JSON.stringify(updatedTasks));
    
    return newTask;
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get existing tasks
    const tasksData = localStorage.getItem(this.storageKey);
    const tasks: Task[] = tasksData ? JSON.parse(tasksData) : [];
    
    // Find task index
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    // Update task
    const updatedTask: Task = { ...tasks[taskIndex], ...updates };
    tasks[taskIndex] = updatedTask;
    
    // Save back to localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    
    return updatedTask;
  }

  async deleteTask(taskId: string): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get existing tasks
    const tasksData = localStorage.getItem(this.storageKey);
    const tasks: Task[] = tasksData ? JSON.parse(tasksData) : [];
    
    // Filter out deleted task
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    
    // Save back to localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(updatedTasks));
  }
  
  // Helper method to check for overdue tasks
  async checkOverdueTasks(userId: string): Promise<void> {
    // Get existing tasks
    const tasksData = localStorage.getItem(this.storageKey);
    const tasks: Task[] = tasksData ? JSON.parse(tasksData) : [];
    
    let updated = false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check each task
    const updatedTasks = tasks.map(task => {
      if (task.userId === userId && task.status === 'todo' && task.expectedCompletionDate) {
        const dueDate = new Date(task.expectedCompletionDate);
        if (dueDate < today) {
          updated = true;
          return { ...task, status: 'overdue' as const };
        }
      }
      return task;
    });
    
    // Update storage if changes were made
    if (updated) {
      localStorage.setItem(this.storageKey, JSON.stringify(updatedTasks));
    }
  }
}

export default new TasksService();
