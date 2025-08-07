import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Footer } from './components/Layout/Footer';
import { ChatPanel } from './components/Chat/ChatPanel';
import { CodeEditor } from './components/CodeEditor/CodeEditor';
import { LivePreview } from './components/Preview/LivePreview';
import { MediaGenerator } from './components/Media/MediaGenerator';
import { SettingsPanel } from './components/Settings/SettingsPanel';
import { ProjectManager } from './components/Projects/ProjectManager';
import { useStore } from './hooks/useStore';
import { initializeAutoSave, cleanupAutoSave } from './hooks/useStore';
import { PerformanceManager } from './utils/performance';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [showPreview, setShowPreview] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, userSettings, isOnline } = useStore();

  // Initialize auto-save and performance optimizations
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize auto-save
        initializeAutoSave();
        
        // Preload critical resources
        if (userSettings.cacheEnabled) {
          PerformanceManager.preloadResource('/api/models');
        }

        // Simulate app initialization (remove in production)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsLoading(false);
      } catch (error) {
        console.error('App initialization error:', error);
        setIsLoading(false);
      }
    };

    initializeApp();

    return () => {
      cleanupAutoSave();
    };
  }, [userSettings.autoSave, userSettings.cacheEnabled]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Loading screen
  if (isLoading) {
    return (
      <div className="h-screen bg-dark-950 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-4 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl shadow-lg mb-4 mx-auto w-fit">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </motion.div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-2">
            ApporWebs
          </h1>
          <p className="text-dark-400">Loading your AI workspace...</p>
        </motion.div>
      </div>
    );
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="flex h-full">
            <div className={`${showPreview ? 'w-1/2' : 'w-full'} border-r border-dark-700/50`}>
              <ChatPanel />
            </div>
            {showPreview && (
              <motion.div
                className="w-1/2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LivePreview />
              </motion.div>
            )}
          </div>
        );
      
      case 'code':
        return (
          <div className="flex h-full">
            <div className={`${showPreview ? 'w-1/2' : 'w-full'} border-r border-dark-700/50`}>
              <CodeEditor />
            </div>
            {showPreview && (
              <motion.div
                className="w-1/2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LivePreview />
              </motion.div>
            )}
          </div>
        );
      
      case 'media':
        return <MediaGenerator />;
      
      case 'settings':
        return <SettingsPanel />;
      
      case 'projects':
        return <ProjectManager />;
      
      default:
        return <ChatPanel />;
    }
  };

  return (
    <div className="h-screen bg-dark-950 text-white overflow-hidden relative">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-5 pointer-events-none" />
      
      {/* Gradient Overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary-600/5 via-transparent to-accent-600/5 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-tr from-transparent via-dark-950/50 to-transparent pointer-events-none" />
      
      <div className="relative z-10 h-full flex flex-col">
        <Header />
        
        <div className="flex-1 flex overflow-hidden">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          
          <main className="flex-1 overflow-hidden relative">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full"
            >
              {renderMainContent()}
            </motion.div>
          </main>
        </div>

        <Footer />
      </div>

      {/* Toggle Preview Button */}
      {(activeTab === 'chat' || activeTab === 'code') && (
        <motion.button
          onClick={() => setShowPreview(!showPreview)}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-gradient-to-r from-primary-600 to-accent-600 p-3 sm:p-4 rounded-full shadow-2xl hover:shadow-primary-500/25 transition-all duration-300 z-50 group"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
        >
          <motion.svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: showPreview ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={showPreview ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
            />
          </motion.svg>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-dark-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </div>
        </motion.button>
      )}

      {/* Offline Indicator */}
      {!isOnline && (
        <motion.div
          className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 bg-error-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          You're offline. Some features may be limited.
        </motion.div>
      )}

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgb(30, 41, 59)',
            color: 'white',
            border: '1px solid rgb(71, 85, 105)',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: 'rgb(34, 197, 94)',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: 'rgb(239, 68, 68)',
              secondary: 'white',
            },
          },
        }}
      />
    </div>
  );
}

export default App;