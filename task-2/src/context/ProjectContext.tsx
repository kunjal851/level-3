import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Task } from '../types';
import * as localStorageService from '../services/localStorage';

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  addProject: (project: Omit<Project, '_id' | 'createdAt' | 'tasks'>) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  addTask: (projectId: string, task: Omit<Task, '_id' | 'createdAt'>) => void;
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (projectId: string, taskId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load projects from localStorage on component mount
  useEffect(() => {
    try {
      setLoading(true);
      const storedProjects = localStorageService.getProjects();
      setProjects(storedProjects);
      setError(null);
    } catch (err) {
      console.error('Error loading projects from localStorage:', err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addProject = (project: Omit<Project, '_id' | 'createdAt' | 'tasks'>) => {
    try {
      setLoading(true);
      const newProject = localStorageService.addProject(project);
      setProjects(prevProjects => [...prevProjects, newProject]);
    } catch (err) {
      console.error('Error adding project:', err);
      setError('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    try {
      setLoading(true);
      const updatedProject = localStorageService.updateProjectInStorage(projectId, updates);
      if (updatedProject) {
        setProjects(prevProjects =>
          prevProjects.map(project =>
            project._id === projectId ? updatedProject : project
          )
        );
      }
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Failed to update project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = (projectId: string) => {
    try {
      setLoading(true);
      localStorageService.deleteProjectFromStorage(projectId);
      setProjects(prevProjects => prevProjects.filter(project => project._id !== projectId));
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addTask = (projectId: string, task: Omit<Task, '_id' | 'createdAt'>) => {
    try {
      setLoading(true);
      const updatedProject = localStorageService.addTaskToProject(projectId, task);
      if (updatedProject) {
        setProjects(prevProjects =>
          prevProjects.map(project =>
            project._id === projectId ? updatedProject : project
          )
        );
      }
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = (projectId: string, taskId: string, updates: Partial<Task>) => {
    try {
      setLoading(true);
      const updatedProject = localStorageService.updateTaskInProject(projectId, taskId, updates);
      if (updatedProject) {
        setProjects(prevProjects =>
          prevProjects.map(project =>
            project._id === projectId ? updatedProject : project
          )
        );
      }
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = (projectId: string, taskId: string) => {
    try {
      setLoading(true);
      const updatedProject = localStorageService.deleteTaskFromProject(projectId, taskId);
      if (updatedProject) {
        setProjects(prevProjects =>
          prevProjects.map(project =>
            project._id === projectId ? updatedProject : project
          )
        );
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        error,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
