
import DashboardLayout from '@/components/layout/DashboardLayout';
import KanbanBoard from '@/components/tasks/KanbanBoard';
import { TasksProvider } from '@/contexts/TasksContext';

const DashboardPage = () => {
  return (
    <TasksProvider>
      <DashboardLayout>
        <KanbanBoard />
      </DashboardLayout>
    </TasksProvider>
  );
};

export default DashboardPage;
