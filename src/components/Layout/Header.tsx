import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sun, Moon, Settings, Zap, Wifi, WifiOff, Save, Clock, Monitor } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { Button } from '../UI/Button';
import { formatDistanceToNow } from 'date-fns';

export const Header: React.FC = () => {
  const { 
    theme, 
    setTheme, 
    isOnline, 
    lastSaved, 
    currentProject,
    isGenerating,
    userSettings,
    updateUserSettings,
    setCurrentProject
  } = useStore();
  
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
    updateUserSettings({ theme: newTheme });
    setShowThemeMenu(false);
    
    // Apply theme immediately
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (newTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(newTheme);
    }
  };

  // Listen for system theme changes when auto mode is selected
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="w-4 h-4" />;
      case 'dark': return <Moon className="w-4 h-4" />;
      case 'auto': return <Monitor className="w-4 h-4" />;
      default: return <Moon className="w-4 h-4" />;
    }
  };

  const handleLogoClick = () => {
    // Navigate to home/main view
    setCurrentProject(null);
    // You can add additional navigation logic here
  };

  return (
    <motion.header 
      className="h-16 sm:h-16 bg-dark-900/95 backdrop-blur-xl border-b border-dark-700/50 flex items-center justify-between px-4 sm:px-6 relative z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center space-x-2 sm:space-x-4">
        <motion.button 
          onClick={handleLogoClick}
          className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative">
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl shadow-lg">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            {isGenerating && (
              <motion.div
                className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-accent-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              ApporWebs
            </h1>
            <p className="text-xs text-dark-400 hidden sm:block">Super Intelligent AI Agent</p>
          </div>
        </motion.button>

        {currentProject && (
          <motion.div
            className="hidden md:flex items-center space-x-2 bg-dark-800/50 rounded-lg px-3 py-1.5 border border-dark-600/50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            <span className="text-sm text-dark-200 font-medium truncate max-w-32">
              {currentProject.name}
            </span>
          </motion.div>
        )}
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Online Status */}
        <motion.div 
          className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg ${
            isOnline 
              ? 'bg-success-500/10 border border-success-500/20' 
              : 'bg-error-500/10 border border-error-500/20'
          }`}
          whileHover={{ scale: 1.05 }}
        >
          {isOnline ? (
            <Wifi className="w-3 h-3 text-success-500" />
          ) : (
            <WifiOff className="w-3 h-3 text-error-500" />
          )}
          <span className={`text-xs font-medium hidden sm:inline ${
            isOnline ? 'text-success-400' : 'text-error-400'
          }`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </motion.div>

        {/* Last Saved */}
        {lastSaved && (
          <motion.div
            className="hidden lg:flex items-center space-x-2 text-xs text-dark-400 bg-dark-800/30 rounded-lg px-3 py-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Save className="w-3 h-3" />
            <span>
              Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
            </span>
          </motion.div>
        )}

        {/* Theme Selector */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-2 hover:bg-dark-700/50"
          >
            {getThemeIcon()}
          </Button>

          <AnimatePresence>
            {showThemeMenu && (
              <motion.div
                className="absolute right-0 top-full mt-2 bg-dark-800/95 backdrop-blur-xl border border-dark-600/50 rounded-lg shadow-xl py-2 min-w-[120px] z-50"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {[
                  { value: 'light', label: 'Light', icon: Sun },
                  { value: 'dark', label: 'Dark', icon: Moon },
                  { value: 'auto', label: 'Auto', icon: Monitor },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleThemeChange(option.value as any)}
                    className={`w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-dark-700/50 transition-colors ${
                      theme === option.value ? 'text-primary-400 bg-primary-500/10' : 'text-dark-200'
                    }`}
                  >
                    <option.icon className="w-4 h-4" />
                    <span>{option.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Performance Indicator */}
        <motion.div
          className="hidden sm:flex items-center space-x-1 text-xs text-dark-400"
          whileHover={{ scale: 1.05 }}
        >
          <Zap className="w-3 h-3 text-accent-500" />
          <span className="hidden md:inline">Ultra Fast</span>
        </motion.div>
      </div>

      {/* Click outside to close theme menu */}
      {showThemeMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowThemeMenu(false)}
        />
      )}
    </motion.header>
  );
};