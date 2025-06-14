import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useTheme } from '../context/ThemeContext';

interface ProjectFormProps {
  editMode?: boolean;
  projectId?: string;
}

export default function ProjectForm({ editMode = false, projectId }: ProjectFormProps) {
  const { projects, addProject, updateProject } = useProjects();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  
  const existingProject = editMode && projectId 
    ? projects.find(p => p._id === projectId) 
    : null;
  
  const [title, setTitle] = useState(existingProject?.title || '');
  const [description, setDescription] = useState(existingProject?.description || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Project title is required');
      return;
    }
    
    if (editMode && projectId) {
      updateProject(projectId, { title, description });
      navigate(`/projects/${projectId}`);
    } else {
      addProject({ title, description });
      navigate('/projects');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className={`text-2xl font-bold ${darkMode ? 'dark:text-white' : 'text-gray-800'} mb-6`}>
        {editMode ? 'Edit Project' : 'Create New Project'}
      </h1>
      
      <form onSubmit={handleSubmit} className={`${darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-lg shadow-sm border`}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="title" className={`block text-sm font-medium ${darkMode ? 'dark:text-gray-300' : 'text-gray-700'} mb-1`}>
            Project Title*
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full p-2 border rounded-md ${darkMode ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-white' : 'border-gray-300'}`}
            placeholder="Enter project title"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className={`block text-sm font-medium ${darkMode ? 'dark:text-gray-300' : 'text-gray-700'} mb-1`}>
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full p-2 border rounded-md h-32 ${darkMode ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-white' : 'border-gray-300'}`}
            placeholder="Enter project description"
          ></textarea>
        </div>
        
        <div className="flex gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            {editMode ? 'Update Project' : 'Create Project'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
