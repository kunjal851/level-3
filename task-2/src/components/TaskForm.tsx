import { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useTheme } from '../context/ThemeContext';
import { Task } from '../types';

interface TaskFormProps {
  projectId: string;
  task?: Task;
  onComplete: () => void;
}

export default function TaskForm({ projectId, task, onComplete }: TaskFormProps) {
  const { addTask, updateTask } = useProjects();
  const { darkMode } = useTheme();
  
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<Task['status']>(task?.status || 'todo');
  const [deadline, setDeadline] = useState(task?.deadline || '');
  const [assignee, setAssignee] = useState(task?.assignee || '');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    
    if (task) {
      // Update existing task
      updateTask(projectId, task._id, {
        title,
        description,
        status,
        deadline,
        assignee
      });
    } else {
      // Add new task
      addTask(projectId, {
        title,
        description,
        status,
        deadline,
        assignee
      });
    }
    
    onComplete();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="title" className={`block text-sm font-medium ${darkMode ? 'dark:text-gray-300' : 'text-gray-700'} mb-1`}>
          Task Title*
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full p-2 border rounded-md ${darkMode ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-white' : 'border-gray-300'}`}
          placeholder="Enter task title"
        />
      </div>
      
      <div>
        <label htmlFor="description" className={`block text-sm font-medium ${darkMode ? 'dark:text-gray-300' : 'text-gray-700'} mb-1`}>
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full p-2 border rounded-md ${darkMode ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-white' : 'border-gray-300'}`}
          placeholder="Enter task description"
          rows={3}
        ></textarea>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className={`block text-sm font-medium ${darkMode ? 'dark:text-gray-300' : 'text-gray-700'} mb-1`}>
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Task['status'])}
            className={`w-full p-2 border rounded-md ${darkMode ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-white' : 'border-gray-300'}`}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="assignee" className={`block text-sm font-medium ${darkMode ? 'dark:text-gray-300' : 'text-gray-700'} mb-1`}>
            Assignee
          </label>
          <input
            type="text"
            id="assignee"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className={`w-full p-2 border rounded-md ${darkMode ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-white' : 'border-gray-300'}`}
            placeholder="Assign to"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="deadline" className={`block text-sm font-medium ${darkMode ? 'dark:text-gray-300' : 'text-gray-700'} mb-1`}>
          Deadline
        </label>
        <input
          type="date"
          id="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className={`w-full p-2 border rounded-md ${darkMode ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-white' : 'border-gray-300'}`}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onComplete}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          {task ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}
