import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { format } from 'date-fns';
import { Check, CircleAlert, CirclePlus, Search, Trash2 } from 'lucide-react';

export default function ProjectList() {
  const { projects, loading, error, deleteProject } = useProjects();
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
  const [search, setSearch] = useState('');

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className={`text-2xl font-bold ${darkMode ? 'dark:text-white' : 'text-gray-800'}`}>Projects</h1>
        <Link
          to="/projects/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          <CirclePlus className="mr-2 h-4 w-4" />
          New Project
        </Link>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className={`${darkMode ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-white' : 'bg-white border-gray-300 text-gray-900'} border text-sm rounded-lg block w-full pl-10 p-2.5`}
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-8">
          <p className={`${darkMode ? 'dark:text-gray-400' : 'text-gray-500'} mb-4`}>
            {projects.length === 0 
              ? "No projects yet" 
              : "No projects match your search"}
          </p>
          {projects.length === 0 && (
            <Link
              to="/projects/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              <CirclePlus className="mr-2 h-4 w-4" />
              Create your first project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map(project => (
            <div 
              key={project._id} 
              className={`${darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : 'bg-white border-gray-200'} p-5 rounded-lg shadow-sm border flex flex-col`}
            >
              <div className="flex justify-between items-start mb-3">
                <Link to={`/projects/${project._id}`} className="group">
                  <h2 className={`text-lg font-medium ${darkMode ? 'dark:text-white group-hover:text-blue-400' : 'text-gray-800 group-hover:text-blue-600'}`}>
                    {project.title}
                  </h2>
                </Link>
                <button
                  onClick={() => deleteProject(project._id)}
                  className="text-gray-400 hover:text-red-500"
                  aria-label="Delete project"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <p className={`text-sm ${darkMode ? 'dark:text-gray-400' : 'text-gray-500'} line-clamp-2 mb-4`}>
                {project.description || "No description"}
              </p>
              
              <div className="mt-auto">
                <div className={`flex justify-between items-center text-xs ${darkMode ? 'dark:text-gray-400' : 'text-gray-500'}`}>
                  <span>{format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-1" />
                    <span>
                      {project.tasks.filter(t => t.status === 'completed').length}/{project.tasks.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
