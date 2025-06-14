import { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useTheme } from '../context/ThemeContext';
import { Task } from '../types';
import { format } from 'date-fns';
import { Clock, Pencil, Trash2 } from 'lucide-react';
import TaskForm from './TaskForm';

interface TaskListProps {
  projectId: string;
  tasks: Task[];
}

export default function TaskList({ projectId, tasks }: TaskListProps) {
  const { updateTask, deleteTask } = useProjects();
  const { darkMode } = useTheme();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleUpdateStatus = (taskId: string, newStatus: Task['status']) => {
    updateTask(projectId, taskId, { status: newStatus });
  };
  
  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(projectId, taskId);
    }
  };
  
  if (tasks.length === 0) {
    return <p className={`text-sm ${darkMode ? 'dark:text-gray-400' : 'text-gray-500'} italic`}>No tasks</p>;
  }
  
  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <div key={task._id}>
          {editingTaskId === task._id ? (
            <TaskForm
              projectId={projectId}
              task={task}
              onComplete={() => setEditingTaskId(null)}
            />
          ) : (
            <div className={`p-3 ${darkMode ? 'dark:bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
              <div className="flex justify-between items-start">
                <h4 className={`font-medium ${darkMode ? 'dark:text-white' : 'text-gray-800'}`}>{task.title}</h4>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setEditingTaskId(task._id)}
                    className="text-gray-400 hover:text-blue-500"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {task.description && (
                <p className={`text-sm ${darkMode ? 'dark:text-gray-300' : 'text-gray-600'} mt-1`}>{task.description}</p>
              )}
              
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                {task.deadline && (
                  <div className={`flex items-center ${darkMode ? 'dark:text-gray-400' : 'text-gray-500'}`}>
                    <Clock className="h-3 w-3 mr-1" />
                    {format(new Date(task.deadline), 'MMM d, yyyy')}
                  </div>
                )}
                
                {task.assignee && (
                  <div className={`px-2 py-1 ${darkMode ? 'dark:bg-gray-600 dark:text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-full`}>
                    {task.assignee}
                  </div>
                )}
                
                <div className={`px-2 py-1 rounded-full ml-auto ${getStatusBadgeColor(task.status)}`}>
                  {task.status === 'todo' ? 'To Do' : 
                   task.status === 'in-progress' ? 'In Progress' : 'Completed'}
                </div>
              </div>
              
              {task.status !== 'completed' && (
                <div className={`mt-3 pt-2 border-t ${darkMode ? 'dark:border-gray-600' : 'border-gray-200'} flex justify-end gap-2`}>
                  {task.status === 'todo' && (
                    <button
                      onClick={() => handleUpdateStatus(task._id, 'in-progress')}
                      className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      Start
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleUpdateStatus(task._id, 'completed')}
                    className="text-xs px-2 py-1 text-green-600 hover:bg-green-50 rounded"
                  >
                    Complete
                  </button>
                </div>
              )}
              
              {task.status === 'completed' && (
                <div className={`mt-3 pt-2 border-t ${darkMode ? 'dark:border-gray-600' : 'border-gray-200'} flex justify-end`}>
                  <button
                    onClick={() => handleUpdateStatus(task._id, 'in-progress')}
                    className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    Reopen
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
