import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, LayoutDashboard, Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { darkMode } = useTheme();
  
  return (
    <div className={`flex flex-col md:flex-row h-screen ${darkMode ? 'dark:bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`md:w-64 ${darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : 'bg-white border-gray-200'} md:border-r p-4`}>
        <div className="mb-8">
          <h1 className={`text-xl font-bold ${darkMode ? 'dark:text-white' : 'text-gray-800'}`}>Taskify</h1>
          <p className={`text-xs ${darkMode ? 'dark:text-gray-400' : 'text-gray-500'}`}>Project Management</p>
        </div>
        
        <nav className="flex md:flex-col space-x-1 md:space-x-0 md:space-y-1 overflow-x-auto md:overflow-visible">
          <Link
            to="/"
            className={`flex items-center px-4 py-3 text-sm rounded-lg whitespace-nowrap ${
              location.pathname === '/'
                ? darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-50 text-blue-700'
                : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link
            to="/projects"
            className={`flex items-center px-4 py-3 text-sm rounded-lg ${
              location.pathname.includes('/projects')
                ? darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-50 text-blue-700'
                : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ClipboardList className="mr-3 h-5 w-5" />
            Projects
          </Link>
          <Link
            to="/settings"
            className={`flex items-center px-4 py-3 text-sm rounded-lg ${
              location.pathname === '/settings'
                ? darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-50 text-blue-700'
                : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Link>
        </nav>
      </div>
      
      {/* Main content */}
      <div className={`flex-1 overflow-auto ${darkMode ? 'dark:bg-gray-900' : ''}`}>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
