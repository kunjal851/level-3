import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useTheme } from '../context/ThemeContext';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import { format } from 'date-fns';
import { AlertTriangle, ArrowLeft, CirclePlus, Pencil, Trash2 } from 'lucide-react';

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, loading, error, deleteProject } = useProjects();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`text-lg ${darkMode ? 'dark:text-white' : 'text-gray-800'}`}>Loading project...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`bg-red-50 text-red-700 p-4 rounded-lg flex items-center`}>
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }
  
  const [showTaskForm, setShowTaskForm] = useState(false);
  
  const project = projects.find(p => p._id === projectId);
  
  if (!project) {
    return (
      <div className="text-center py-8">
        <h2 className={`text-xl font-medium ${darkMode ? 'dark:text-white' : 'text-gray-800'} mb-4`}>Project not found</h2>
        <Link
          to="/projects"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </div>
    );
  }
  
  const handleDeleteProject = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(project._id);
      navigate('/projects');
    }
  };
  
  const todoTasks = project.tasks ? project.tasks.filter(t => t.status === 'todo') : [];
  const inProgressTasks = project.tasks ? project.tasks.filter(t => t.status === 'in-progress') : [];
  const completedTasks = project.tasks ? project.tasks.filter(t => t.status === 'completed') : [];
  
  return (
    <div className="space-y-6">
      {/* Project header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <div className="flex items-center gap-2">
          <Link to="/projects" className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className={`text-2xl font-bold ${darkMode ? 'dark:text-white' : 'text-gray-800'}`}>{project.title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Link
            to={`/projects/${project._id}/edit`}
            className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
          >
            <Pencil className="mr-1 h-4 w-4" />
            Edit
          </Link>
          <button
            onClick={handleDeleteProject}
            className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm hover:bg-red-100"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
      
      {/* Project info */}
      <div className={`${darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-lg shadow-sm border`}>
        <div className="flex justify-between items-start">
          <div>
            <p className={`text-sm ${darkMode ? 'dark:text-gray-400' : 'text-gray-500'}`}>
              Created on {format(new Date(project.createdAt), 'MMMM d, yyyy')}
            </p>
            {project.description && (
              <p className={`mt-4 ${darkMode ? 'dark:text-gray-300' : 'text-gray-700'}`}>{project.description}</p>
            )}
          </div>
          <div className="text-right">
            <p className={`text-sm ${darkMode ? 'dark:text-gray-400' : 'text-gray-500'}`}>Completion</p>
            <p className={`text-xl font-bold ${darkMode ? 'dark:text-white' : ''}`}>
              {project.tasks.length > 0 
                ? Math.round((completedTasks.length / project.tasks.length) * 100) 
                : 0}%
            </p>
          </div>
        </div>
      </div>
      
      {/* Task management */}
      <div className="flex justify-between items-center">
        <h2 className={`text-xl font-medium ${darkMode ? 'dark:text-white' : 'text-gray-800'}`}>Tasks</h2>
        <button
          onClick={() => setShowTaskForm(!showTaskForm)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          <CirclePlus className="mr-2 h-4 w-4" />
          Add Task
        </button>
      </div>
      
      {showTaskForm && (
        <div className={`${darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-lg shadow-sm border`}>
          <TaskForm 
            projectId={project._id} 
            onComplete={() => setShowTaskForm(false)} 
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`${darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-lg shadow-sm border`}>
          <h3 className={`font-medium ${darkMode ? 'dark:text-white' : 'text-gray-800'} mb-3 pb-2 border-b ${darkMode ? 'dark:border-gray-700' : ''}`}>To Do ({todoTasks.length})</h3>
          <TaskList projectId={project._id} tasks={todoTasks} />
        </div>
        
        <div className={`${darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-lg shadow-sm border`}>
          <h3 className={`font-medium ${darkMode ? 'dark:text-white' : 'text-gray-800'} mb-3 pb-2 border-b ${darkMode ? 'dark:border-gray-700' : ''}`}>In Progress ({inProgressTasks.length})</h3>
          <TaskList projectId={project._id} tasks={inProgressTasks} />
        </div>
        
        <div className={`${darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-lg shadow-sm border`}>
          <h3 className={`font-medium ${darkMode ? 'dark:text-white' : 'text-gray-800'} mb-3 pb-2 border-b ${darkMode ? 'dark:border-gray-700' : ''}`}>Completed ({completedTasks.length})</h3>
          <TaskList projectId={project._id} tasks={completedTasks} />
        </div>
      </div>
    </div>
  );
}
