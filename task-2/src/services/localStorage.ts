import { Project, Task } from '../types';

// Storage keys
const PROJECTS_STORAGE_KEY = 'projectpulse_projects';

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Get all projects from localStorage
export const getProjects = (): Project[] => {
  try {
    const projectsJson = localStorage.getItem(PROJECTS_STORAGE_KEY);
    return projectsJson ? JSON.parse(projectsJson) : [];
  } catch (error) {
    console.error('Error retrieving projects from localStorage:', error);
    return [];
  }
};

// Save all projects to localStorage
export const saveProjects = (projects: Project[]): void => {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving projects to localStorage:', error);
  }
};

// Get a single project by ID
export const getProject = (projectId: string): Project | undefined => {
  const projects = getProjects();
  return projects.find(project => project._id === projectId);
};

// Add a new project
export const addProject = (project: Omit<Project, '_id' | 'createdAt' | 'tasks'>): Project => {
  const projects = getProjects();
  const newProject: Project = {
    _id: generateId(),
    title: project.title,
    description: project.description,
    tasks: [],
    createdAt: new Date().toISOString()
  };
  
  const updatedProjects = [...projects, newProject];
  saveProjects(updatedProjects);
  return newProject;
};

// Update an existing project
export const updateProjectInStorage = (
  projectId: string, 
  updates: Partial<Omit<Project, '_id' | 'createdAt' | 'tasks'>>
): Project | null => {
  const projects = getProjects();
  const projectIndex = projects.findIndex(p => p._id === projectId);
  
  if (projectIndex === -1) return null;
  
  const updatedProject = { 
    ...projects[projectIndex],
    ...updates
  };
  
  projects[projectIndex] = updatedProject;
  saveProjects(projects);
  return updatedProject;
};

// Delete a project
export const deleteProjectFromStorage = (projectId: string): void => {
  const projects = getProjects();
  const filteredProjects = projects.filter(p => p._id !== projectId);
  saveProjects(filteredProjects);
};

// Add a task to a project
export const addTaskToProject = (
  projectId: string, 
  task: Omit<Task, '_id' | 'createdAt'>
): Project | null => {
  const projects = getProjects();
  const projectIndex = projects.findIndex(p => p._id === projectId);
  
  if (projectIndex === -1) return null;
  
  const newTask: Task = {
    _id: generateId(),
    title: task.title,
    description: task.description,
    status: task.status || 'todo',
    deadline: task.deadline || '',
    assignee: task.assignee || '',
    createdAt: new Date().toISOString()
  };
  
  const updatedProject = { 
    ...projects[projectIndex],
    tasks: [...projects[projectIndex].tasks, newTask]
  };
  
  projects[projectIndex] = updatedProject;
  saveProjects(projects);
  return updatedProject;
};

// Update a task in a project
export const updateTaskInProject = (
  projectId: string, 
  taskId: string, 
  updates: Partial<Omit<Task, '_id' | 'createdAt'>>
): Project | null => {
  const projects = getProjects();
  const projectIndex = projects.findIndex(p => p._id === projectId);
  
  if (projectIndex === -1) return null;
  
  const taskIndex = projects[projectIndex].tasks.findIndex(t => t._id === taskId);
  
  if (taskIndex === -1) return null;
  
  const updatedTask = { 
    ...projects[projectIndex].tasks[taskIndex],
    ...updates
  };
  
  const updatedTasks = [...projects[projectIndex].tasks];
  updatedTasks[taskIndex] = updatedTask;
  
  const updatedProject = { 
    ...projects[projectIndex],
    tasks: updatedTasks
  };
  
  projects[projectIndex] = updatedProject;
  saveProjects(projects);
  return updatedProject;
};

// Delete a task from a project
export const deleteTaskFromProject = (projectId: string, taskId: string): Project | null => {
  const projects = getProjects();
  const projectIndex = projects.findIndex(p => p._id === projectId);
  
  if (projectIndex === -1) return null;
  
  const updatedProject = { 
    ...projects[projectIndex],
    tasks: projects[projectIndex].tasks.filter(t => t._id !== taskId)
  };
  
  projects[projectIndex] = updatedProject;
  saveProjects(projects);
  return updatedProject;
};
