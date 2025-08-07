import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, 
  Image, 
  MessageSquare, 
  FolderOpen, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  Zap,
  Shield
} from 'lucide-react';
import { Button } from '../UI/Button';
import { useStore } from '../../hooks/useStore';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { addProject, projects, currentProject, isOnline } = useStore();

  const tabs = [
    { 
      id: 'chat', 
      icon: MessageSquare, 
      label: 'AI Chat', 
      description: 'Natural language to code',
      badge: 'AI'
    },
    { 
      id: 'code', 
      icon: Code, 
      label: 'Code Editor', 
      description: 'Advanced code editing',
      badge: 'Pro'
    },
    { 
      id: 'projects', 
      icon: FolderOpen, 
      label: 'Projects', 
      description: 'Manage your workspace',
      badge: projects.length.toString()
    },
    { 
      id: 'media', 
      icon: Image, 
      label: 'Media Gen', 
      description: 'AI-powered media creation',
      badge: 'New'
    },
    { 
      id: 'settings', 
      icon: Settings, 
      label: 'Settings', 
      description: 'Configure your environment',
      badge: null
    },
  ];

  const handleNewProject = () => {
    const projectName = `Project ${projects.length + 1}`;
    addProject({
      name: projectName,
      description: 'New AI-generated project',
      files: [],
      isPublic: false,
      tags: ['new'],
      framework: 'react',
      language: 'typescript',
    });
  };

  return (
    <motion.aside 
      className={`bg-dark-900/95 backdrop-blur-xl border-r border-dark-700/50 flex flex-col transition-all duration-300 relative z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="p-4 flex-1">
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              <Button 
                variant="primary" 
                size="sm" 
                className="w-full relative overflow-hidden group"
                onClick={handleNewProject}
                disabled={!isOnline}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-accent-600 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.05 }}
                />
                <div className="relative flex items-center justify-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>New Project</span>
                </div>
              </Button>
            </motion.div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 ml-auto hover:bg-dark-700/50"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        <nav className="space-y-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-600/20 to-accent-600/20 border border-primary-500/30 text-primary-400 shadow-lg'
                  : 'hover:bg-dark-700/50 text-dark-300 hover:text-white border border-transparent'
              }`}
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {/* Animated background for active tab */}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-accent-600/10"
                  layoutId="activeTab"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              )}

              <div className="relative flex items-center w-full">
                <div className="relative">
                  <tab.icon className="w-5 h-5 flex-shrink-0" />
                  {tab.badge && !isCollapsed && (
                    <motion.div
                      className={`absolute -top-2 -right-2 px-1.5 py-0.5 text-xs font-bold rounded-full ${
                        tab.badge === 'AI' ? 'bg-accent-500 text-white' :
                        tab.badge === 'Pro' ? 'bg-primary-500 text-white' :
                        tab.badge === 'New' ? 'bg-success-500 text-white' :
                        'bg-dark-600 text-dark-200'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {tab.badge}
                    </motion.div>
                  )}
                </div>

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      className="ml-3 flex-1 text-left"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="font-medium text-sm">{tab.label}</div>
                      <div className="text-xs text-dark-400 group-hover:text-dark-300">
                        {tab.description}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {activeTab === tab.id && (
                  <motion.div
                    className="ml-2"
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Sparkles className="w-4 h-4 text-accent-400" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-dark-700/50">
        {!isCollapsed ? (
          <motion.div
            className="bg-gradient-to-br from-primary-600/10 via-accent-600/10 to-primary-600/10 rounded-xl p-4 border border-primary-500/20 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-4 h-4 text-primary-400" />
              <div className="text-sm font-medium text-primary-400">Ultra Secure</div>
            </div>
            <div className="text-xs text-dark-400 mb-3">
              WebContainer isolation with enterprise-grade encryption
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-3 h-3 text-accent-400" />
              <div className="text-xs text-accent-400 font-medium">15+ AI Models</div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col items-center space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
};