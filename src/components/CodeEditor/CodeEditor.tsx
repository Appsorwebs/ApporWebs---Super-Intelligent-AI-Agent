import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Editor } from '@monaco-editor/react';
import { Play, Save, Download, RefreshCw, Maximize2 } from 'lucide-react';
import { Button } from '../UI/Button';
import { useStore } from '../../hooks/useStore';

export const CodeEditor: React.FC = () => {
  const { currentProject, updateProject } = useStore();
  const [code, setCode] = useState(currentProject?.files[0]?.content || `// Welcome to ApporWebs Code Editor
// AI-powered code generation and editing

import React from 'react';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Hello, ApporWebs!
        </h1>
        <p className="text-blue-200 text-lg">
          AI-powered development at your fingertips
        </p>
      </div>
    </div>
  );
};

export default App;
`);

  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Update preview when code changes
  useEffect(() => {
    if (currentProject && code !== currentProject.files[0]?.content) {
      setIsAnalyzing(true);
      
      // Simulate AI analysis with faster completion (800-1200ms)
      const analysisTimer = setTimeout(() => {
        setIsAnalyzing(false);
        
        // Update the project with new code
        if (currentProject.files[0]) {
          const updatedFiles = [...currentProject.files];
          updatedFiles[0] = {
            ...updatedFiles[0],
            content: code,
            lastModified: new Date(),
          };
          
          updateProject(currentProject.id, { files: updatedFiles });
        }
      }, 800 + Math.random() * 400); // 800-1200ms analysis time
      
      return () => clearTimeout(analysisTimer);
    }
  }, [code, currentProject, updateProject]);

  const handleRun = () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => setIsRunning(false), 2000);
  };

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
  ];

  return (
    <div className="flex flex-col h-full bg-dark-950/50">
      <div className="p-4 border-b border-dark-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <div className="text-sm text-dark-400 flex items-center space-x-2">
              <span>Enhanced with AI autocomplete</span>
              {isAnalyzing && (
                <motion.div
                  className="flex items-center space-x-1 text-primary-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span className="text-xs">Analyzing...</span>
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRun}
              isLoading={isRunning}
            >
              <Play className="w-4 h-4 mr-2" />
              Run
            </Button>
            <Button variant="ghost" size="sm">
              <Save className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-full"
        >
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: 'JetBrains Mono, Monaco, Cascadia Code, Segoe UI Mono, monospace',
              minimap: { enabled: true },
              wordWrap: 'on',
              lineNumbers: 'on',
              folding: true,
              bracketPairColorization: { enabled: true },
              guides: {
                bracketPairs: true,
                indentation: true,
              },
              suggest: {
                insertMode: 'replace',
              },
              quickSuggestions: {
                other: true,
                comments: true,
                strings: true,
              },
            }}
          />
        </motion.div>

        {/* AI Analysis Status */}
        {isAnalyzing && (
          <motion.div
            className="absolute top-4 right-4 bg-dark-800/90 backdrop-blur-md rounded-lg p-3 border border-dark-600"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="flex items-center space-x-2 text-sm">
              <RefreshCw className="w-4 h-4 text-primary-400 animate-spin" />
              <span className="text-dark-200">AI analyzing code...</span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-4 border-t border-dark-700">
        <div className="flex items-center justify-between text-sm text-dark-400">
          <div className="flex items-center space-x-4">
            <div>Lines: {code.split('\n').length}</div>
            <div>Characters: {code.length}</div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <span>No errors</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span>AI Enhanced</span>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};