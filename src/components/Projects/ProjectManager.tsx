import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ExternalLink,
  Calendar,
  Tag,
  Code,
  Globe,
  Rocket,
  Download,
  Share2,
  Play,
  Eye
} from 'lucide-react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { useStore } from '../../hooks/useStore';
import { Project, BuildProgress, DeploymentResult } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { DEPLOYMENT_PROVIDERS } from '../../config/deploymentProviders';
import toast from 'react-hot-toast';

export const ProjectManager: React.FC = () => {
  const { 
    projects, 
    currentProject, 
    addProject, 
    updateProject, 
    deleteProject, 
    setCurrentProject,
    deploymentProviders
  } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'public' | 'private'>('all');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState<string | null>(null);
  const [buildProgress, setBuildProgress] = useState<BuildProgress | null>(null);
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    description: '',
    framework: 'react',
    language: 'typescript',
    isPublic: false,
    tags: [] as string[],
  });

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'public' && project.isPublic) ||
                         (filterBy === 'private' && !project.isPublic) ||
                         (filterBy === 'recent' && new Date(project.updatedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    return matchesSearch && matchesFilter;
  });

  const handleCreateProject = () => {
    if (!newProjectData.name.trim()) {
      toast.error('Project name is required');
      return;
    }

    const newProject = addProject({
      ...newProjectData,
      files: generateStarterFiles(newProjectData.framework, newProjectData.language),
      tags: newProjectData.tags.length > 0 ? newProjectData.tags : ['new'],
    });

    setNewProjectData({
      name: '',
      description: '',
      framework: 'react',
      language: 'typescript',
      isPublic: false,
      tags: [],
    });
    
    setShowNewProjectModal(false);
    toast.success('Project created successfully!');
  };

  const generateStarterFiles = (framework: string, language: string) => {
    const ext = language === 'typescript' ? 'tsx' : 'jsx';
    return [
      {
        id: `file-${Date.now()}-1`,
        name: `App.${ext}`,
        path: `src/App.${ext}`,
        content: generateAppContent(framework, language),
        language: language,
        type: 'file' as const,
        size: 1024,
        lastModified: new Date(),
      },
      {
        id: `file-${Date.now()}-2`,
        name: 'index.html',
        path: 'index.html',
        content: generateIndexHTML(),
        language: 'html',
        type: 'file' as const,
        size: 512,
        lastModified: new Date(),
      },
      {
        id: `file-${Date.now()}-3`,
        name: 'package.json',
        path: 'package.json',
        content: generatePackageJSON(framework),
        language: 'json',
        type: 'file' as const,
        size: 256,
        lastModified: new Date(),
      }
    ];
  };

  const generateAppContent = (framework: string, language: string): string => {
    return `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Your ${framework} App
        </h1>
        <p className="text-gray-600 mb-6">
          Built with ApporWebs AI - The future of development
        </p>
        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Get Started
        </button>
        <div className="mt-6 text-sm text-gray-500">
          Powered by ApporWebs
        </div>
      </div>
    </div>
  );
}

export default App;`;
  };

  const generateIndexHTML = (): string => {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ApporWebs Project</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;
  };

  const generatePackageJSON = (framework: string): string => {
    return JSON.stringify({
      name: "apporwebs-project",
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
        "@vitejs/plugin-react": "^4.0.3",
        vite: "^4.4.5"
      }
    }, null, 2);
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId);
      toast.success('Project deleted successfully');
    }
  };

  const handleDeployProject = async (project: Project, provider: string) => {
    setBuildProgress({
      stage: 'Initializing',
      progress: 0,
      message: 'Starting deployment process...',
      timestamp: new Date()
    });

    updateProject(project.id, { buildStatus: 'building', buildProgress: 0 });

    try {
      // Simulate build process
      const stages = [
        { stage: 'Installing dependencies', progress: 20, message: 'npm install...' },
        { stage: 'Building project', progress: 50, message: 'Creating optimized build...' },
        { stage: 'Uploading files', progress: 80, message: 'Deploying to ' + provider + '...' },
        { stage: 'Finalizing', progress: 100, message: 'Deployment complete!' }
      ];

      for (const stage of stages) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setBuildProgress({
          ...stage,
          timestamp: new Date()
        });
        updateProject(project.id, { buildProgress: stage.progress });
      }

      const deploymentUrl = `https://${project.name.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 9)}.${provider}.app`;
      
      updateProject(project.id, {
        buildStatus: 'success',
        buildProgress: 100,
        deploymentUrl,
        lastDeployment: new Date()
      });

      toast.success(`Project deployed successfully to ${provider}!`);
      setBuildProgress(null);
      setShowDeployModal(null);

    } catch (error) {
      updateProject(project.id, { buildStatus: 'error' });
      toast.error('Deployment failed. Please try again.');
      setBuildProgress(null);
    }
  };

  const handleExportProject = (project: Project) => {
    const projectData = {
      name: project.name,
      description: project.description,
      files: project.files,
      framework: project.framework,
      language: project.language,
      createdAt: project.createdAt
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Project exported successfully!');
  };

  const getFrameworkIcon = (framework: string) => {
    switch (framework) {
      case 'react': return '⚛️';
      case 'vue': return '💚';
      case 'angular': return '🅰️';
      case 'svelte': return '🧡';
      case 'next': return '▲';
      case 'nuxt': return '💚';
      case 'gatsby': return '🟣';
      case 'remix': return '💿';
      case 'astro': return '🚀';
      case 'solid': return '🔷';
      default: return '📦';
    }
  };

  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'typescript': return 'bg-blue-500';
      case 'javascript': return 'bg-yellow-500';
      case 'python': return 'bg-green-500';
      case 'java': return 'bg-red-500';
      case 'go': return 'bg-cyan-500';
      default: return 'bg-gray-500';
    }
  };

  const frameworks = [
    { id: 'react', name: 'React', icon: '⚛️' },
    { id: 'vue', name: 'Vue.js', icon: '💚' },
    { id: 'angular', name: 'Angular', icon: '🅰️' },
    { id: 'svelte', name: 'Svelte', icon: '🧡' },
    { id: 'next', name: 'Next.js', icon: '▲' },
    { id: 'nuxt', name: 'Nuxt.js', icon: '💚' },
    { id: 'gatsby', name: 'Gatsby', icon: '🟣' },
    { id: 'remix', name: 'Remix', icon: '💿' },
    { id: 'astro', name: 'Astro', icon: '🚀' },
    { id: 'solid', name: 'SolidJS', icon: '🔷' },
  ];

  return (
    <div className="flex flex-col h-full bg-dark-950/50">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-dark-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Project Manager</h3>
              <p className="text-sm text-dark-400">{projects.length} projects</p>
            </div>
          </div>
          
          <Button
            onClick={() => setShowNewProjectModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 w-full">
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
              className="bg-dark-800/50 border-dark-600/50"
            />
          </div>
          
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as any)}
            className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm w-full sm:w-auto"
          >
            <option value="all">All Projects</option>
            <option value="recent">Recent</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {filteredProjects.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FolderOpen className="w-16 h-16 mx-auto mb-4 text-dark-500" />
            <h3 className="text-lg font-semibold text-dark-300 mb-2">
              {searchTerm ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-dark-400 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms or filters'
                : 'Create your first project to get started with ApporWebs'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowNewProjectModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4 }}
                  className={`bg-dark-800/50 backdrop-blur-sm rounded-xl border p-4 sm:p-6 cursor-pointer transition-all duration-200 ${
                    currentProject?.id === project.id
                      ? 'border-primary-500/50 bg-primary-500/5'
                      : 'border-dark-600/50 hover:border-dark-500/50'
                  }`}
                  onClick={() => setCurrentProject(project)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-xl sm:text-2xl">
                        {getFrameworkIcon(project.framework)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-white truncate text-sm sm:text-base">
                          {project.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${getLanguageColor(project.language)}`} />
                          <span className="text-xs text-dark-400 capitalize">
                            {project.language}
                          </span>
                          {project.buildStatus && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              project.buildStatus === 'success' ? 'bg-success-500/20 text-success-400' :
                              project.buildStatus === 'building' ? 'bg-warning-500/20 text-warning-400' :
                              project.buildStatus === 'error' ? 'bg-error-500/20 text-error-400' :
                              'bg-dark-600/50 text-dark-400'
                            }`}>
                              {project.buildStatus}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {project.isPublic && (
                        <Globe className="w-4 h-4 text-success-500" />
                      )}
                      {project.deploymentUrl && (
                        <ExternalLink className="w-4 h-4 text-primary-500" />
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-dark-400 mb-4 line-clamp-2">
                    {project.description || 'No description provided'}
                  </p>

                  {/* Build Progress */}
                  {project.buildStatus === 'building' && project.buildProgress !== undefined && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-dark-400 mb-1">
                        <span>Building...</span>
                        <span>{project.buildProgress}%</span>
                      </div>
                      <div className="w-full bg-dark-700 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.buildProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-dark-700/50 text-xs text-dark-300 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 py-1 bg-dark-700/50 text-xs text-dark-300 rounded-md">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-dark-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Code className="w-3 h-3" />
                      <span>{project.files.length} files</span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-dark-700/50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentProject(project);
                        toast.success(`Opened ${project.name}`);
                      }}
                      className="text-xs"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Open
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeployModal(project.id);
                      }}
                      className="text-xs"
                    >
                      <Rocket className="w-3 h-3 mr-1" />
                      Deploy
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportProject(project);
                      }}
                      className="text-xs"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Export
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                      className="text-xs text-error-400 hover:text-error-300"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>

                  {/* Deployment URL */}
                  {project.deploymentUrl && (
                    <div className="mt-3 pt-3 border-t border-dark-700/50">
                      <a
                        href={project.deploymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-400 hover:text-primary-300 flex items-center space-x-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Globe className="w-3 h-3" />
                        <span className="truncate">{project.deploymentUrl}</span>
                      </a>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* New Project Modal */}
      <AnimatePresence>
        {showNewProjectModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewProjectModal(false)}
          >
            <motion.div
              className="bg-dark-800 rounded-xl border border-dark-600 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Create New Project</h3>
              
              <div className="space-y-4">
                <Input
                  label="Project Name"
                  value={newProjectData.name}
                  onChange={(e) => setNewProjectData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Awesome Project"
                />
                
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newProjectData.description}
                    onChange={(e) => setNewProjectData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your project..."
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-dark-400 resize-none"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-200 mb-1">
                      Framework
                    </label>
                    <select
                      value={newProjectData.framework}
                      onChange={(e) => setNewProjectData(prev => ({ ...prev, framework: e.target.value }))}
                      className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                    >
                      {frameworks.map(framework => (
                        <option key={framework.id} value={framework.id}>
                          {framework.icon} {framework.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dark-200 mb-1">
                      Language
                    </label>
                    <select
                      value={newProjectData.language}
                      onChange={(e) => setNewProjectData(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="typescript">TypeScript</option>
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="go">Go</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={newProjectData.isPublic}
                    onChange={(e) => setNewProjectData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500"
                  />
                  <label htmlFor="isPublic" className="text-sm text-dark-200">
                    Make this project public
                  </label>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setShowNewProjectModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProject}
                  className="flex-1"
                >
                  Create Project
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deploy Modal */}
      <AnimatePresence>
        {showDeployModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeployModal(null)}
          >
            <motion.div
              className="bg-dark-800 rounded-xl border border-dark-600 p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Deploy Project</h3>
              
              {buildProgress ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-sm text-dark-300 mb-2">{buildProgress.stage}</div>
                    <div className="text-xs text-dark-400 mb-4">{buildProgress.message}</div>
                    <div className="w-full bg-dark-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${buildProgress.progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-dark-400 mt-2">{buildProgress.progress}%</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-dark-400 mb-4">
                    Choose a deployment platform:
                  </p>
                  
                  {DEPLOYMENT_PROVIDERS.map(provider => (
                    <button
                      key={provider.id}
                      onClick={() => {
                        const project = projects.find(p => p.id === showDeployModal);
                        if (project) {
                          handleDeployProject(project, provider.id);
                        }
                      }}
                      className="w-full flex items-center space-x-3 p-3 bg-dark-700/50 hover:bg-dark-600/50 rounded-lg border border-dark-600/50 hover:border-dark-500/50 transition-all"
                    >
                      <span className="text-xl">{provider.icon}</span>
                      <div className="text-left flex-1">
                        <div className="font-medium text-white">{provider.name}</div>
                        <div className="text-xs text-dark-400">{provider.description}</div>
                      </div>
                      <Rocket className="w-4 h-4 text-primary-400" />
                    </button>
                  ))}
                  
                  <Button
                    variant="ghost"
                    onClick={() => setShowDeployModal(null)}
                    className="w-full mt-4"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};