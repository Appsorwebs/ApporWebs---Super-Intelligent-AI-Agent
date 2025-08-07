import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Project, ChatMessage, APIKey, DeploymentProvider, UserSettings, SecuritySettings, PerformanceSettings } from '../types';
import { SecurityManager } from '../utils/security';
import { PerformanceManager } from '../utils/performance';
import { DEPLOYMENT_PROVIDERS } from '../config/deploymentProviders';

interface StoreState extends AppState {
  // Theme and UI
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  
  // Projects
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  saveProject: (project: Project) => void;
  
  // Chat
  addChatMessage: (message: ChatMessage) => void;
  clearChatMessages: () => void;
  updateChatMessage: (id: string, updates: Partial<ChatMessage>) => void;
  
  // API Keys
  addAPIKey: (apiKey: Omit<APIKey, 'id' | 'createdAt' | 'usageCount'>) => void;
  removeAPIKey: (id: string) => void;
  updateAPIKey: (id: string, updates: Partial<APIKey>) => void;
  
  // AI Models
  setSelectedModel: (model: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  
  // Deployment
  updateDeploymentProvider: (id: string, updates: Partial<DeploymentProvider>) => void;
  connectDeploymentProvider: (id: string, credentials: any) => void;
  
  // Settings
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => void;
  updatePerformanceSettings: (settings: Partial<PerformanceSettings>) => void;
  
  // System
  setOnlineStatus: (isOnline: boolean) => void;
  updateLastSaved: () => void;
}

const defaultUserSettings: UserSettings = {
  theme: 'dark',
  language: 'en',
  autoSave: true,
  codeCompletion: true,
  livePreview: true,
  notifications: true,
  analytics: false,
  fontSize: 14,
  tabSize: 2,
  wordWrap: true,
  minimap: true,
  lineNumbers: true,
  bracketPairColorization: true,
};

const defaultSecuritySettings: SecuritySettings = {
  encryptionEnabled: true,
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  twoFactorAuth: false,
  ipWhitelist: [],
  auditLog: true,
};

const defaultPerformanceSettings: PerformanceSettings = {
  cacheEnabled: true,
  preloadModels: false,
  maxConcurrentRequests: 5,
  requestTimeout: 30000,
  compressionLevel: 6,
  lazyLoading: true,
};

// Create sample projects for demonstration
const createSampleProjects = (): Project[] => [
  {
    id: 'sample-1',
    name: 'React Todo App',
    description: 'A modern todo application built with React and TypeScript',
    files: [
      {
        id: 'file-1',
        name: 'App.tsx',
        path: 'src/App.tsx',
        content: `import React, { useState } from 'react';
import './App.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: inputValue,
        completed: false
      }]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Todo App
        </h1>
        
        <div className="flex mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTodo}
            className="px-6 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {todos.map(todo => (
            <li key={todo.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5 text-blue-500"
              />
              <span className={\`flex-1 \${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}\`}>
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No tasks yet. Add one above!</p>
        )}
        
        <div className="mt-6 text-center text-sm text-gray-500">
          Built with ApporWebs AI
        </div>
      </div>
    </div>
  );
}

export default App;`,
        language: 'typescript',
        type: 'file',
        size: 2048,
        lastModified: new Date(),
      },
      {
        id: 'file-2',
        name: 'index.html',
        path: 'index.html',
        content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Todo App</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
        language: 'html',
        type: 'file',
        size: 512,
        lastModified: new Date(),
      }
    ],
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(Date.now() - 3600000), // 1 hour ago
    isPublic: false,
    tags: ['react', 'typescript', 'todo'],
    framework: 'react',
    language: 'typescript',
  },
  {
    id: 'sample-2',
    name: 'Vue Dashboard',
    description: 'A beautiful dashboard built with Vue.js',
    files: [
      {
        id: 'file-3',
        name: 'App.vue',
        path: 'src/App.vue',
        content: `<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-800">Vue Dashboard</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-600">Welcome, User</span>
            <div class="w-8 h-8 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div v-for="stat in stats" :key="stat.label" class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">{{ stat.label }}</h3>
          <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div class="space-y-3">
            <div v-for="activity in activities" :key="activity.id" class="flex items-center space-x-3">
              <div :class="activity.color" class="w-2 h-2 rounded-full"></div>
              <span class="text-sm text-gray-600">{{ activity.text }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div class="grid grid-cols-2 gap-3">
            <button v-for="action in actions" :key="action.name" 
                    :class="action.color" 
                    class="p-3 text-white rounded-lg transition-colors">
              {{ action.name }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="mt-8 text-center text-sm text-gray-500">
        Built with ApporWebs AI
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      stats: [
        { label: 'Total Users', value: '1,234' },
        { label: 'Revenue', value: '$45,678' },
        { label: 'Orders', value: '890' },
        { label: 'Growth', value: '+12.5%' }
      ],
      activities: [
        { id: 1, text: 'New user registered', color: 'bg-green-500' },
        { id: 2, text: 'Order #1234 completed', color: 'bg-blue-500' },
        { id: 3, text: 'Payment pending', color: 'bg-yellow-500' }
      ],
      actions: [
        { name: 'Add User', color: 'bg-blue-500 hover:bg-blue-600' },
        { name: 'New Order', color: 'bg-green-500 hover:bg-green-600' },
        { name: 'Reports', color: 'bg-purple-500 hover:bg-purple-600' },
        { name: 'Settings', color: 'bg-orange-500 hover:bg-orange-600' }
      ]
    }
  }
}
</script>`,
        language: 'vue',
        type: 'file',
        size: 1536,
        lastModified: new Date(),
      }
    ],
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    updatedAt: new Date(Date.now() - 7200000), // 2 hours ago
    isPublic: true,
    tags: ['vue', 'dashboard', 'admin'],
    framework: 'vue',
    language: 'javascript',
  }
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state - NO DEFAULT MODEL SELECTED
      theme: 'dark',
      currentProject: null,
      projects: createSampleProjects(),
      chatMessages: [],
      apiKeys: [],
      selectedModel: '', // Empty by default - user must select
      isGenerating: false,
      deploymentProviders: DEPLOYMENT_PROVIDERS,
      userSettings: defaultUserSettings,
      securitySettings: defaultSecuritySettings,
      performanceSettings: defaultPerformanceSettings,
      isOnline: navigator.onLine,
      lastSaved: null,

      // Theme and UI
      setTheme: (theme) => {
        set({ theme });
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        
        if (theme === 'auto') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          root.classList.add(prefersDark ? 'dark' : 'light');
        } else {
          root.classList.add(theme);
        }
      },

      // Projects
      setCurrentProject: (project) => {
        set({ currentProject: project });
        if (project) {
          get().updateLastSaved();
        }
      },

      addProject: (projectData) => {
        const project: Project = {
          ...projectData,
          id: SecurityManager.generateSecureId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set(state => ({
          projects: [...state.projects, project],
          currentProject: project,
        }));
        
        get().updateLastSaved();
        return project;
      },

      updateProject: (id, updates) => {
        set(state => ({
          projects: state.projects.map(p => 
            p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
          ),
          currentProject: state.currentProject?.id === id 
            ? { ...state.currentProject, ...updates, updatedAt: new Date() }
            : state.currentProject,
        }));
        
        get().updateLastSaved();
      },

      deleteProject: (id) => {
        set(state => ({
          projects: state.projects.filter(p => p.id !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject,
        }));
      },

      saveProject: (project) => {
        const state = get();
        const existingIndex = state.projects.findIndex(p => p.id === project.id);
        
        if (existingIndex >= 0) {
          get().updateProject(project.id, project);
        } else {
          set(state => ({
            projects: [...state.projects, project],
          }));
        }
        
        get().updateLastSaved();
      },

      // Chat
      addChatMessage: (message) => {
        const messageWithId = {
          ...message,
          id: message.id || SecurityManager.generateSecureId(),
        };
        
        set(state => ({ 
          chatMessages: [...state.chatMessages, messageWithId] 
        }));
      },

      clearChatMessages: () => set({ chatMessages: [] }),

      updateChatMessage: (id, updates) => {
        set(state => ({
          chatMessages: state.chatMessages.map(msg =>
            msg.id === id ? { ...msg, ...updates } : msg
          ),
        }));
      },

      // API Keys
      addAPIKey: (apiKeyData) => {
        if (!SecurityManager.validateApiKey(apiKeyData.key)) {
          throw new Error('Invalid API key format');
        }

        const apiKey: APIKey = {
          ...apiKeyData,
          id: SecurityManager.generateSecureId(),
          key: SecurityManager.encrypt(apiKeyData.key),
          createdAt: new Date(),
          usageCount: 0,
        };
        
        set(state => ({ 
          apiKeys: [...state.apiKeys, apiKey] 
        }));
      },

      removeAPIKey: (id) => {
        set(state => ({ 
          apiKeys: state.apiKeys.filter(key => key.id !== id) 
        }));
      },

      updateAPIKey: (id, updates) => {
        set(state => ({
          apiKeys: state.apiKeys.map(key =>
            key.id === id ? { ...key, ...updates } : key
          ),
        }));
      },

      // AI Models
      setSelectedModel: (model) => set({ selectedModel: model }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),

      // Deployment
      updateDeploymentProvider: (id, updates) => {
        set(state => ({
          deploymentProviders: state.deploymentProviders.map(provider =>
            provider.id === id ? { ...provider, ...updates } : provider
          ),
        }));
      },

      connectDeploymentProvider: (id, credentials) => {
        const encryptedCredentials = {
          ...credentials,
          apiKey: credentials.apiKey ? SecurityManager.encrypt(credentials.apiKey) : undefined,
        };
        
        get().updateDeploymentProvider(id, {
          connected: true,
          ...encryptedCredentials,
        });
      },

      // Settings
      updateUserSettings: (settings) => {
        set(state => ({
          userSettings: { ...state.userSettings, ...settings },
        }));
      },

      updateSecuritySettings: (settings) => {
        set(state => ({
          securitySettings: { ...state.securitySettings, ...settings },
        }));
      },

      updatePerformanceSettings: (settings) => {
        set(state => ({
          performanceSettings: { ...state.performanceSettings, ...settings },
        }));
      },

      // System
      setOnlineStatus: (isOnline) => set({ isOnline }),
      updateLastSaved: () => set({ lastSaved: new Date() }),
    }),
    {
      name: 'apporwebs-store',
      partialize: (state) => ({
        theme: state.theme,
        projects: state.projects,
        apiKeys: state.apiKeys,
        selectedModel: state.selectedModel,
        deploymentProviders: state.deploymentProviders,
        userSettings: state.userSettings,
        securitySettings: state.securitySettings,
        performanceSettings: state.performanceSettings,
      }),
    }
  )
);

// Auto-save functionality
let autoSaveInterval: NodeJS.Timeout;

export const initializeAutoSave = () => {
  const store = useStore.getState();
  
  if (store.userSettings.autoSave) {
    autoSaveInterval = setInterval(() => {
      const currentState = useStore.getState();
      if (currentState.currentProject) {
        currentState.saveProject(currentState.currentProject);
      }
    }, 30000); // Auto-save every 30 seconds
  }
};

export const cleanupAutoSave = () => {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
  }
};

// Online status monitoring
window.addEventListener('online', () => useStore.getState().setOnlineStatus(true));
window.addEventListener('offline', () => useStore.getState().setOnlineStatus(false));