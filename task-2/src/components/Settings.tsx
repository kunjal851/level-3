import { useTheme } from '../context/ThemeContext';
import { Database, Moon, Sun } from 'lucide-react';

export default function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();
  
  return (
    <div className={`max-w-2xl mx-auto ${darkMode ? 'dark:text-white' : ''}`}>
      <h1 className={`text-2xl font-bold ${darkMode ? 'dark:text-white' : 'text-gray-800'} mb-6`}>Settings</h1>
      
      <div className={`${darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-lg shadow-sm border mb-6`}>
        <div className="space-y-6">
          <div>
            <h2 className={`text-lg font-medium ${darkMode ? 'dark:text-white' : 'text-gray-800'} mb-2`}>Theme</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={darkMode ? 'dark:text-gray-200' : 'text-gray-700'}>Dark Mode</p>
                  <p className={`text-sm ${darkMode ? 'dark:text-gray-400' : 'text-gray-500'}`}>Switch between light and dark themes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={darkMode} 
                    onChange={toggleDarkMode} 
                    className="sr-only peer" 
                  />
                  <div className={`w-11 h-6 ${darkMode ? 'bg-blue-600' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}>
                  </div>
                  <span className="ml-2">
                    {darkMode ? (
                      <Moon className="h-5 w-5 text-blue-100" />
                    ) : (
                      <Sun className="h-5 w-5 text-amber-500" />
                    )}
                  </span>
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className={`text-lg font-medium ${darkMode ? 'dark:text-white' : 'text-gray-800'} mb-2`}>Data Storage</h2>
            <div className="flex items-start">
              <Database className="h-5 w-5 text-blue-500 mt-1 mr-3" />
              <div>
                <p className={`${darkMode ? 'dark:text-gray-200' : 'text-gray-700'}`}>
                  Local Browser Storage
                </p>
                <p className={`text-sm ${darkMode ? 'dark:text-gray-400' : 'text-gray-500'} mt-1`}>
                  Taskify uses browser localStorage for data persistence. Your projects and tasks are stored locally on your device.
                </p>
                <div className="mt-4 p-3 bg-amber-50 text-amber-700 text-sm rounded border border-amber-100">
                  <p className="font-medium">Note:</p>
                  <ul className="list-disc pl-5 mt-1 text-xs space-y-1">
                    <li>Data is only stored on this device</li>
                    <li>Clearing browser data will delete your projects</li>
                    <li>Projects are not synchronized between devices</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
