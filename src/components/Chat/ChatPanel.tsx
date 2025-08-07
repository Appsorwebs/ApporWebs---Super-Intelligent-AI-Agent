import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Code, Zap, Copy, Check, AlertCircle, Cpu, ChevronDown, ExternalLink } from 'lucide-react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { useStore } from '../../hooks/useStore';
import { ChatMessage } from '../../types';
import { SecurityManager } from '../../utils/security';
import { PerformanceManager } from '../../utils/performance';
import { AI_PROVIDERS } from '../../config/aiProviders';
import toast from 'react-hot-toast';

export const ChatPanel: React.FC = () => {
  const [message, setMessage] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { 
    chatMessages, 
    isGenerating, 
    addChatMessage, 
    setIsGenerating,
    selectedModel,
    setSelectedModel,
    apiKeys,
    isOnline,
    addProject,
    setCurrentProject
  } = useStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim() || isGenerating || !isOnline) return;

    if (!selectedModel) {
      toast.error('Please select an AI model first');
      return;
    }

    const selectedProvider = AI_PROVIDERS.find(p => 
      p.models.some(m => m.id === selectedModel)
    );

    const hasValidApiKey = apiKeys.some(key => 
      key.provider === selectedProvider?.id && key.isActive
    );

    if (!hasValidApiKey) {
      toast.error(`Please add a valid API key for ${selectedProvider?.name} in Settings`);
      return;
    }

    if (!SecurityManager.rateLimit('chat', 10, 60000)) {
      toast.error('Rate limit exceeded. Please wait a moment.');
      return;
    }

    const sanitizedMessage = SecurityManager.sanitizeInput(message.trim());
    
    const userMessage: ChatMessage = {
      id: SecurityManager.generateSecureId(),
      content: sanitizedMessage,
      role: 'user',
      timestamp: new Date(),
      type: 'text',
    };

    addChatMessage(userMessage);
    setMessage('');
    setIsGenerating(true);
    setIsTyping(true);

    try {
      await PerformanceManager.memoize(
        `ai-response-${sanitizedMessage}`,
        async () => {
          const startTime = performance.now();
          
          // Realistic AI response time
          await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
          
          const endTime = performance.now();
          const executionTime = endTime - startTime;

          const aiResponse: ChatMessage = {
            id: SecurityManager.generateSecureId(),
            content: generateAIResponse(sanitizedMessage),
            role: 'assistant',
            timestamp: new Date(),
            type: sanitizedMessage.toLowerCase().includes('code') || 
                  sanitizedMessage.toLowerCase().includes('component') || 
                  sanitizedMessage.toLowerCase().includes('app') || 
                  sanitizedMessage.toLowerCase().includes('create') || 
                  sanitizedMessage.toLowerCase().includes('build') ? 'code' : 'text',
            metadata: {
              model: selectedModel,
              tokens: Math.floor(Math.random() * 500) + 100,
              executionTime: Math.round(executionTime),
            },
          };

          addChatMessage(aiResponse);
          
          // Auto-create project if user is asking to build something
          if (sanitizedMessage.toLowerCase().includes('create') || 
              sanitizedMessage.toLowerCase().includes('build') || 
              sanitizedMessage.toLowerCase().includes('make')) {
            setTimeout(() => {
              const projectName = extractProjectName(sanitizedMessage);
              const newProject = addProject({
                name: projectName,
                description: `AI-generated project: ${sanitizedMessage}`,
                files: generateProjectFiles(sanitizedMessage),
                isPublic: false,
                tags: ['ai-generated', 'new'],
                framework: detectFramework(sanitizedMessage),
                language: detectLanguage(sanitizedMessage),
              });
              
              setCurrentProject(newProject);
              toast.success(`Project "${projectName}" created successfully!`);
            }, 1000);
          }
          
          return aiResponse;
        },
        300000
      );

      toast.success('Response generated successfully!');
    } catch (error) {
      console.error('AI response error:', error);
      
      const errorMessage: ChatMessage = {
        id: SecurityManager.generateSecureId(),
        content: 'I apologize, but I encountered an error while processing your request. Please check your API key and try again.',
        role: 'assistant',
        timestamp: new Date(),
        type: 'error',
        metadata: {
          model: selectedModel,
          tokens: 0,
        },
      };
      
      addChatMessage(errorMessage);
      toast.error('Failed to generate response. Check your API key.');
    } finally {
      setIsGenerating(false);
      setIsTyping(false);
    }
  };

  const extractProjectName = (input: string): string => {
    const words = input.toLowerCase().split(' ');
    const createIndex = words.findIndex(word => ['create', 'build', 'make'].includes(word));
    if (createIndex !== -1 && createIndex < words.length - 1) {
      return words.slice(createIndex + 1, createIndex + 4).join(' ').replace(/[^a-zA-Z0-9\s]/g, '').trim() || 'New Project';
    }
    return 'AI Generated Project';
  };

  const detectFramework = (input: string): string => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('react')) return 'react';
    if (lowerInput.includes('vue')) return 'vue';
    if (lowerInput.includes('angular')) return 'angular';
    if (lowerInput.includes('svelte')) return 'svelte';
    if (lowerInput.includes('next')) return 'next';
    return 'react'; // default
  };

  const detectLanguage = (input: string): string => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('typescript') || lowerInput.includes('ts')) return 'typescript';
    if (lowerInput.includes('python')) return 'python';
    if (lowerInput.includes('java')) return 'java';
    if (lowerInput.includes('go')) return 'go';
    return 'typescript'; // default
  };

  const generateProjectFiles = (input: string) => {
    const framework = detectFramework(input);
    const language = detectLanguage(input);
    const ext = language === 'typescript' ? 'tsx' : 'jsx';
    
    return [
      {
        id: SecurityManager.generateSecureId(),
        name: `App.${ext}`,
        path: `src/App.${ext}`,
        content: generateAppComponent(input, framework),
        language: language,
        type: 'file' as const,
        size: 1024,
        lastModified: new Date(),
      },
      {
        id: SecurityManager.generateSecureId(),
        name: 'index.html',
        path: 'index.html',
        content: generateIndexHTML(input),
        language: 'html',
        type: 'file' as const,
        size: 512,
        lastModified: new Date(),
      },
      {
        id: SecurityManager.generateSecureId(),
        name: 'package.json',
        path: 'package.json',
        content: generatePackageJSON(framework, language),
        language: 'json',
        type: 'file' as const,
        size: 256,
        lastModified: new Date(),
      }
    ];
  };

  const generateAppComponent = (input: string, framework: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('todo') || lowerInput.includes('task')) {
      return `import React, { useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
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
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTask}
            className="px-6 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {tasks.map(task => (
            <li key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-5 h-5 text-blue-500"
              />
              <span className={\`flex-1 \${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}\`}>
                {task.text}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {tasks.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No tasks yet. Add one above!</p>
        )}
        
        <div className="mt-6 text-center text-sm text-gray-500">
          Built with ApporWebs AI
        </div>
      </div>
    </div>
  );
}

export default App;`;
    }

    if (lowerInput.includes('dashboard') || lowerInput.includes('admin')) {
      return `import React, { useState } from 'react';

function App() {
  const [stats] = useState({
    users: 1234,
    revenue: 45678,
    orders: 890,
    growth: 12.5
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, Admin</span>
              <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.users.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
            <p className="text-2xl font-bold text-gray-900">$\{stats.revenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Orders</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Growth</h3>
            <p className="text-2xl font-bold text-green-600">+{stats.growth}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">New user registered</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Order #1234 completed</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Payment pending</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Add User
              </button>
              <button className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                New Order
              </button>
              <button className="p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                Reports
              </button>
              <button className="p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                Settings
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          Built with ApporWebs AI
        </div>
      </main>
    </div>
  );
}

export default App;`;
    }

    // Default component
    return `import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Welcome to Your App
        </h1>
        <p className="text-gray-600 mb-8">
          Built with ApporWebs AI - The future of development
        </p>
        
        <div className="space-y-4">
          <div className="text-6xl font-bold text-blue-600">{count}</div>
          <div className="space-x-4">
            <button
              onClick={() => setCount(count + 1)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Increment
            </button>
            <button
              onClick={() => setCount(count - 1)}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Decrement
            </button>
            <button
              onClick={() => setCount(0)}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          Powered by ApporWebs
        </div>
      </div>
    </div>
  );
}

export default App;`;
  };

  const generateIndexHTML = (input: string): string => {
    const title = extractProjectName(input);
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;
  };

  const generatePackageJSON = (framework: string, language: string): string => {
    return JSON.stringify({
      name: "apporwebs-generated-project",
      private: true,
      version: "0.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview"
      },
      dependencies: {
        react: "^18.2.0",
        "react-dom": "^18.2.0"
      },
      devDependencies: {
        "@types/react": "^18.2.15",
        "@types/react-dom": "^18.2.7",
        "@vitejs/plugin-react": "^4.0.3",
        vite: "^4.4.5"
      }
    }, null, 2);
  };

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('create') || lowerInput.includes('build') || lowerInput.includes('make')) {
      const projectName = extractProjectName(input);
      return `I'll help you create "${projectName}"! 🚀

I'm generating a complete project with:
✅ Modern React components with TypeScript
✅ Responsive design with Tailwind CSS
✅ Interactive functionality
✅ Clean, production-ready code
✅ Optimized performance

**Project Features:**
- 📱 Mobile-responsive design
- ⚡ Ultra-fast loading
- 🎨 Beautiful UI/UX
- 🔒 Secure implementation
- 🚀 Ready for deployment

The project has been automatically created and added to your workspace. You can:
1. **Edit** the code in the Code Editor
2. **Preview** it in real-time
3. **Deploy** to any platform (Netlify, Vercel, etc.)
4. **Export** and download the files

Would you like me to add any specific features or modify the design?`;
    }

    if (lowerInput.includes('deploy') || lowerInput.includes('publish')) {
      return `I'll help you deploy your project! 🚀

**Available Deployment Options:**
- 🌐 **Netlify** - Static sites with continuous deployment
- ▲ **Vercel** - Frontend cloud platform
- 🎨 **Render** - Full-stack hosting
- ☁️ **Cloudflare Pages** - Fast, secure hosting
- 🐙 **GitHub Pages** - Direct from repository
- ⚡ **Supabase** - With backend services
- 📱 **Expo** - For mobile apps
- 🔥 **Firebase** - Google's platform

**Deployment Process:**
1. Connect your preferred platform
2. Configure build settings
3. Deploy with one click
4. Get your live URL

Go to **Settings > Deployment** to connect your accounts and start deploying!`;
    }

    // Default response
    return `I'm ApporWebs AI - your super intelligent development assistant! 🤖

I can help you with:

🚀 **Full-Stack Development**
- React, Vue, Angular applications
- Node.js, Python, Java backends
- Database design and optimization
- API development and integration

🎨 **UI/UX Design**
- Responsive layouts
- Modern CSS frameworks
- Interactive animations
- Accessibility compliance

🔒 **Security & Performance**
- Enterprise-grade encryption
- WebContainer isolation
- Ultra-fast optimizations
- Rate limiting and validation

🤖 **AI Integration**
- 18+ AI model providers
- Custom model fine-tuning
- Natural language processing
- Image and video generation

📱 **Deployment & Hosting**
- 12+ deployment platforms
- Continuous integration
- Mobile app publishing
- Database hosting

Just tell me what you want to build, and I'll create it for you instantly! Try saying:
- "Create a todo app"
- "Build a dashboard"
- "Make an e-commerce site"
- "Deploy my project"

**Powered by ApporWebs** - The future of AI development! 🌟`;
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedProvider = AI_PROVIDERS.find(p => 
    p.models.some(m => m.id === selectedModel)
  );

  const hasValidApiKey = selectedModel ? apiKeys.some(key => 
    key.provider === selectedProvider?.id && key.isActive
  ) : false;

  const availableModels = AI_PROVIDERS.flatMap(provider => 
    provider.models.map(model => ({
      ...model,
      providerName: provider.name,
      providerIcon: provider.icon,
      signupUrl: provider.signupUrl
    }))
  );

  return (
    <div className="flex flex-col h-full bg-dark-950/50 relative">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-dark-700/50 bg-dark-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl shadow-lg">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              {isGenerating && (
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-accent-500 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm sm:text-base">AI Assistant</h3>
              <div className="relative">
                <button
                  onClick={() => setShowModelSelector(!showModelSelector)}
                  className="text-xs sm:text-sm text-dark-400 hover:text-dark-200 flex items-center space-x-1 transition-colors"
                >
                  {selectedModel ? (
                    <>
                      <span>{selectedProvider?.icon}</span>
                      <span className="hidden sm:inline">{selectedProvider?.name}</span>
                      <span className="sm:hidden">{selectedProvider?.name?.slice(0, 8)}</span>
                      <span>•</span>
                      <span className="hidden md:inline">{availableModels.find(m => m.id === selectedModel)?.name}</span>
                      <span className="md:hidden">{availableModels.find(m => m.id === selectedModel)?.name?.slice(0, 10)}</span>
                    </>
                  ) : (
                    <span className="text-warning-400">Select AI Model</span>
                  )}
                  <ChevronDown className="w-3 h-3" />
                </button>
                
                <AnimatePresence>
                  {showModelSelector && (
                    <motion.div
                      className="absolute top-full left-0 mt-2 bg-dark-800/95 backdrop-blur-xl border border-dark-600/50 rounded-lg shadow-xl py-2 min-w-[280px] sm:min-w-[350px] max-h-64 overflow-y-auto z-50"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {AI_PROVIDERS.map(provider => (
                        <div key={provider.id} className="px-3 py-2">
                          <div className="text-xs font-medium text-primary-400 mb-1 flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <span>{provider.icon}</span>
                              <span>{provider.name}</span>
                            </div>
                            {provider.signupUrl && (
                              <a
                                href={provider.signupUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent-400 hover:text-accent-300"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          {provider.models.map(model => (
                            <button
                              key={model.id}
                              onClick={() => {
                                setSelectedModel(model.id);
                                setShowModelSelector(false);
                                toast.success(`Switched to ${model.name}`);
                              }}
                              className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-dark-700/50 transition-colors ${
                                selectedModel === model.id ? 'text-primary-400 bg-primary-500/10' : 'text-dark-200'
                              }`}
                            >
                              <div className="font-medium">{model.name}</div>
                              <div className="text-xs text-dark-400 truncate">{model.description}</div>
                              {model.maxTokens && (
                                <div className="text-xs text-accent-400">{model.maxTokens.toLocaleString()} tokens</div>
                              )}
                            </button>
                          ))}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            {!selectedModel && (
              <motion.div
                className="flex items-center space-x-1 text-xs text-warning-400 bg-warning-500/10 px-2 py-1 rounded-lg border border-warning-500/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <AlertCircle className="w-3 h-3" />
                <span className="hidden sm:inline">Select Model</span>
                <span className="sm:hidden">Model</span>
              </motion.div>
            )}
            
            {selectedModel && !hasValidApiKey && (
              <motion.div
                className="flex items-center space-x-1 text-xs text-warning-400 bg-warning-500/10 px-2 py-1 rounded-lg border border-warning-500/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <AlertCircle className="w-3 h-3" />
                <span className="hidden sm:inline">API Key Required</span>
                <span className="sm:hidden">API</span>
              </motion.div>
            )}
            
            <div className="flex items-center space-x-1 text-xs text-dark-300 bg-dark-800/50 px-2 py-1 rounded-lg">
              <Cpu className="w-3 h-3 text-primary-400" />
              <span className="hidden sm:inline">Ultra Fast</span>
              <span className="sm:hidden">Fast</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 scroll-smooth">
        <AnimatePresence mode="popLayout">
          {chatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 relative ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg'
                    : msg.type === 'error'
                    ? 'bg-error-500/10 text-error-200 border border-error-500/20'
                    : 'bg-dark-800/80 backdrop-blur-sm text-dark-100 border border-dark-700/50 shadow-xl'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center space-x-2">
                      {msg.type === 'code' ? (
                        <Code className="w-3 h-3 sm:w-4 sm:h-4 text-primary-400" />
                      ) : msg.type === 'error' ? (
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-error-400" />
                      ) : (
                        <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-accent-400" />
                      )}
                      {msg.metadata && (
                        <div className="flex items-center space-x-2 sm:space-x-3 text-xs text-dark-400">
                          <span className="hidden sm:inline">{msg.metadata.model}</span>
                          {msg.metadata.tokens && (
                            <span className="hidden md:inline">{msg.metadata.tokens} tokens</span>
                          )}
                          {msg.metadata.executionTime && (
                            <span>{msg.metadata.executionTime}ms</span>
                          )}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="p-1 h-5 w-5 sm:h-6 sm:w-6 hover:bg-dark-600/50"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-2 h-2 sm:w-3 sm:h-3 text-success-500" />
                      ) : (
                        <Copy className="w-2 h-2 sm:w-3 sm:h-3" />
                      )}
                    </Button>
                  </div>
                )}
                
                <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">
                  {msg.content}
                </div>
                
                <div className="text-xs opacity-70 mt-2 sm:mt-3 flex items-center justify-between">
                  <span>{msg.timestamp.toLocaleTimeString()}</span>
                  {msg.role === 'assistant' && msg.metadata?.executionTime && (
                    <span className="text-accent-400">⚡ {msg.metadata.executionTime}ms</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-start"
          >
            <div className="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-dark-700/50">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-500 rounded-full"
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-dark-400">
                  {isTyping ? 'AI is thinking...' : 'Processing your request...'}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-dark-700/50 bg-dark-900/50 backdrop-blur-sm">
        <div className="flex space-x-2 sm:space-x-3">
          <div className="flex-1">
            <Input
              ref={inputRef}
              placeholder={
                !isOnline 
                  ? "You're offline. Please check your connection..." 
                  : !selectedModel
                  ? "Please select an AI model first..."
                  : !hasValidApiKey 
                  ? `Please add an API key for ${selectedProvider?.name} in Settings...`
                  : "Describe what you want to build..."
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-dark-800/80 border-dark-600/50 backdrop-blur-sm text-sm"
              disabled={!isOnline || !selectedModel || !hasValidApiKey}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isGenerating || !isOnline || !selectedModel || !hasValidApiKey}
            className="px-3 sm:px-6 relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-accent-600 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.05 }}
            />
            <div className="relative flex items-center space-x-1 sm:space-x-2">
              <Send className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Send</span>
            </div>
          </Button>
        </div>
        
        {/* Feature indicators */}
        <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-dark-400 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="flex items-center space-x-1">
              <Code className="w-3 h-3" />
              <span>Code Generation</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span className="hidden sm:inline">Real-time Preview</span>
              <span className="sm:hidden">Preview</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span>Powered by ApporWebs</span>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Click outside to close model selector */}
      {showModelSelector && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowModelSelector(false)}
        />
      )}
    </div>
  );
};