import { useProjects } from '../context/ProjectContext';
import { useTheme } from '../context/ThemeContext';
import { Check, CircleAlert, CirclePlus, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function Dashboard() {
  const { projects, loading, error } = useProjects();
  const { darkMode } = useTheme();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`text-lg ${darkMode ? 'dark:text-white' : 'text-gray-800'}`}>Loading projects...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`bg-red-50 text-red-700 p-4 rounded-lg flex items-center`}>
          <CircleAlert className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalProjects = projects.length;
  const totalTasks = projects.reduce((acc, project) => acc + project.tasks.length, 0);
  const completedTasks = projects.reduce(
    (acc, project) => 
      acc + project.tasks.filter(task => task.status === 'completed').length, 
    0
  );
  
  // Get tasks due today
  const today = new Date().toISOString().split('T')[0];
  const tasksToday = projects.flatMap(project => 
    project.tasks.filter(task => 
      task.deadline === today && task.status !== 'completed'
    ).map(task => ({
      ...task,
      projectId: project._id,
      projectTitle: project.title
    }))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${darkMode ? 'dark:text-white' : 'text-gray-800'}`}>Dashboard</h1>
        <Link
          to="/projects/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          <CirclePlus className="mr-2 h-4 w-4" />
          New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-lg shadow-sm border`}>
          <h2 className={`text-lg font-medium ${darkMode ? 'dark:text-white' : 'text-gray-800'}`}>Projects</h2>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? 'dark:text-white' : ''}`}>{totalProjects}</p>
        </div>
        <div className={`${darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-lg shadow-sm border`}>
          <h2 className={`text-lg font-medium ${darkMode ? 'dark:text-white' : 'text-gray-800'}`}>Tasks</h2>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? 'dark:text-white' : ''}`}>{totalTasks}</p>
        </div>
        <div className={`${darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-lg shadow-sm border`}>
          <h2 className={`text-lg font-medium ${darkMode ? 'dark:text-white' : 'text-gray-800'}`}>Completed</h2>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? 'dark:text-white' : ''}`}>
            {completedTasks} 
            <span className={`text-sm ${darkMode ? 'dark:text-gray-400' : 'text-gray-500'} font-normal ml-1`}>
              ({totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%)
            </span>
          </p>
        </div>
      </div>

      {/* Due today */}
      <div className={`${darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-lg shadow-sm border`}>
        <div className="flex items-center mb-4">
          <Clock className="h-5 w-5 text-amber-500 mr-2" />
          <h2 className={`text-lg font-medium ${darkMode ? 'dark:text-white' : 'text-gray-800'}`}>Due Today</h2>
        </div>
        
        {tasksToday.length === 0 ? (
          <p className={`${darkMode ? 'dark:text-gray-400' : 'text-gray-500'} text-sm`}>No tasks due today</p>
        ) : (
          <div className="space-y-3">
            {tasksToday.map(task => (
              <Link 
                key={task.id} 
                to={`/projects/${task.projectId}`}
                className={`block p-3 border ${darkMode ? 'dark:bg-gray-700 dark:border-gray-600 hover:dark:bg-gray-600' : 'border-gray-100 hover:bg-gray-50'} rounded-lg`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`font-medium ${darkMode ? 'dark:text-white' : 'text-gray-800'}`}>{task.title}</p>
                    <p className={`text-xs ${darkMode ? 'dark:text-gray-400' : 'text-gray-500'}`}>
                      Project: {task.projectTitle}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.status === 'todo' 
                      ? darkMode ? 'bg-gray-600 text-gray-100' : 'bg-gray-100 text-gray-800' 
                      : darkMode ? 'bg-blue-800 text-blue-100' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {task.status === 'todo' ? 'To Do' : 'In Progress'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Recent projects */}
      <div className={`${darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-lg shadow-sm border`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-medium ${darkMode ? 'dark:text-white' : 'text-gray-800'}`}>Recent Projects</h2>
          <Link to="/projects" className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
            View all
          </Link>
        </div>
        
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <p className={`${darkMode ? 'dark:text-gray-400' : 'text-gray-500'} mb-4`}>No projects yet</p>
            <Link
              to="/projects/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              <CirclePlus className="mr-2 h-4 w-4" />
              Create your first project
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.slice(0, 3).map(project => (
              <Link 
                key={project._id} 
                to={`/projects/${project._id}`}
                className={`block p-4 border ${darkMode ? 'dark:bg-gray-700 dark:border-gray-600 hover:dark:bg-gray-600' : 'border-gray-100 hover:bg-gray-50'} rounded-lg`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`font-medium ${darkMode ? 'dark:text-white' : 'text-gray-800'}`}>{project.title}</p>
                    <p className={`text-xs ${darkMode ? 'dark:text-gray-400' : 'text-gray-500'} mt-1`}>
                      {format(new Date(project.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-1" />
                    <span className={`text-xs ${darkMode ? 'dark:text-gray-400' : 'text-gray-500'}`}>
                      {project.tasks.filter(t => t.status === 'completed').length}/{project.tasks.length}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
