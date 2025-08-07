import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Tablet, RefreshCw, ExternalLink, Eye } from 'lucide-react';
import { Button } from '../UI/Button';

export const LivePreview: React.FC = () => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState('');

  const devices = [
    { id: 'desktop', icon: Monitor, label: 'Desktop', width: '100%' },
    { id: 'tablet', icon: Tablet, label: 'Tablet', width: '768px' },
    { id: 'mobile', icon: Smartphone, label: 'Mobile', width: '375px' },
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  // Enhanced preview content with actual functionality
  const previewContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ApporWebs Preview</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in {
            animation: fadeIn 0.6s ease-out;
          }
          .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
        </style>
    </head>
    <body class="gradient-bg min-h-screen">
        <div class="container mx-auto px-6 py-12">
            <div class="text-center fade-in">
                <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
                    Hello, ApporWebs!
                </h1>
                <p class="text-blue-200 text-lg md:text-xl mb-8">
                    AI-powered development at your fingertips
                </p>
                <div class="space-y-4">
                    <button 
                      onclick="showAlert()" 
                      class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Get Started
                    </button>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        <div class="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 fade-in" style="animation-delay: 0.2s">
                            <div class="text-4xl mb-4">🤖</div>
                            <h3 class="text-white font-semibold mb-2">AI Code Generation</h3>
                            <p class="text-blue-200 text-sm">Generate complex applications with natural language</p>
                        </div>
                        <div class="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 fade-in" style="animation-delay: 0.4s">
                            <div class="text-4xl mb-4">⚡</div>
                            <h3 class="text-white font-semibold mb-2">Real-time Preview</h3>
                            <p class="text-blue-200 text-sm">See your changes instantly across all devices</p>
                        </div>
                        <div class="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 fade-in" style="animation-delay: 0.6s">
                            <div class="text-4xl mb-4">🌐</div>
                            <h3 class="text-white font-semibold mb-2">Multi-language Support</h3>
                            <p class="text-blue-200 text-sm">Work with any programming language or framework</p>
                        </div>
                    </div>
                    <div class="mt-12 fade-in" style="animation-delay: 0.8s">
                        <div class="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
                            <h4 class="text-white font-semibold mb-4">Live Demo Features:</h4>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div class="text-center">
                                    <div class="text-2xl mb-2">🔒</div>
                                    <div class="text-blue-200">Secure</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl mb-2">🚀</div>
                                    <div class="text-blue-200">Fast</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl mb-2">📱</div>
                                    <div class="text-blue-200">Responsive</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl mb-2">🎨</div>
                                    <div class="text-blue-200">Beautiful</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script>
          function showAlert() {
            alert('Welcome to ApporWebs! This is a live preview with interactive functionality.');
          }
          
          // Add some interactivity
          document.addEventListener('DOMContentLoaded', function() {
            const cards = document.querySelectorAll('.bg-white\\/10');
            cards.forEach(card => {
              card.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                  this.style.transform = 'scale(1)';
                }, 150);
              });
            });
          });
        </script>
    </body>
    </html>
  `;

  return (
    <div className="flex flex-col h-full bg-dark-950/50">
      <div className="p-4 border-b border-dark-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {devices.map((deviceOption) => (
              <Button
                key={deviceOption.id}
                variant={device === deviceOption.id ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setDevice(deviceOption.id as any)}
                className="flex items-center space-x-2"
              >
                <deviceOption.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{deviceOption.label}</span>
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-dark-400">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Live Preview</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <motion.div
          className="h-full bg-white rounded-lg border border-dark-600 overflow-hidden shadow-2xl"
          style={{ 
            maxWidth: devices.find(d => d.id === device)?.width,
            margin: '0 auto',
          }}
          layout
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {isLoading ? (
            <div className="h-full flex items-center justify-center bg-dark-800">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
                <p className="text-dark-300">Loading preview...</p>
              </div>
            </div>
          ) : (
            <iframe
              srcDoc={previewContent}
              className="w-full h-full border-0"
              title="Live Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          )}
        </motion.div>
      </div>

      <div className="p-4 border-t border-dark-700">
        <div className="flex items-center justify-between text-sm text-dark-400">
          <div className="flex items-center space-x-4">
            <div>Device: {devices.find(d => d.id === device)?.label}</div>
            <div>Responsive: ✓</div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <span>Connected</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="hidden sm:inline">Auto-refresh enabled</span>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};