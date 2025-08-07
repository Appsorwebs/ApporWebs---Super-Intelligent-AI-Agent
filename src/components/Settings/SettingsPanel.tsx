import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Key, 
  Palette, 
  Globe, 
  Shield, 
  Zap, 
  Monitor,
  Smartphone,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Check,
  AlertCircle,
  Github,
  Cloud,
  Database,
  ChevronDown,
  Info,
  ExternalLink
} from 'lucide-react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { useStore } from '../../hooks/useStore';
import { AI_PROVIDERS } from '../../config/aiProviders';
import { DEPLOYMENT_PROVIDERS } from '../../config/deploymentProviders';
import { SecurityManager } from '../../utils/security';
import toast from 'react-hot-toast';

export const SettingsPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('api-keys');
  const [showApiKey, setShowApiKey] = useState<string | null>(null);
  const [newApiKey, setNewApiKey] = useState({ provider: '', key: '' });
  const [newDeploymentCreds, setNewDeploymentCreds] = useState({ provider: '', apiKey: '', username: '' });
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);
  
  const { 
    apiKeys, 
    addAPIKey, 
    removeAPIKey,
    deploymentProviders,
    connectDeploymentProvider,
    userSettings,
    updateUserSettings,
    securitySettings,
    updateSecuritySettings,
    performanceSettings,
    updatePerformanceSettings,
    theme,
    setTheme
  } = useStore();

  const sections = [
    { id: 'api-keys', icon: Key, label: 'AI Models', description: 'Manage AI model API keys' },
    { id: 'deployment', icon: Cloud, label: 'Deployment', description: 'Connect deployment services' },
    { id: 'appearance', icon: Palette, label: 'Appearance', description: 'Customize theme and layout' },
    { id: 'language', icon: Globe, label: 'Language', description: 'Interface language settings' },
    { id: 'privacy', icon: Shield, label: 'Privacy & Security', description: 'Data and privacy settings' },
    { id: 'performance', icon: Zap, label: 'Performance', description: 'Optimization settings' },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  ];

  const frameworks = [
    { id: 'react', name: 'React', icon: '⚛️', description: 'Popular UI library' },
    { id: 'vue', name: 'Vue.js', icon: '💚', description: 'Progressive framework' },
    { id: 'angular', name: 'Angular', icon: '🅰️', description: 'Full-featured framework' },
    { id: 'svelte', name: 'Svelte', icon: '🧡', description: 'Compile-time framework' },
    { id: 'next', name: 'Next.js', icon: '▲', description: 'React framework' },
    { id: 'nuxt', name: 'Nuxt.js', icon: '💚', description: 'Vue framework' },
    { id: 'gatsby', name: 'Gatsby', icon: '🟣', description: 'Static site generator' },
    { id: 'remix', name: 'Remix', icon: '💿', description: 'Full-stack framework' },
    { id: 'astro', name: 'Astro', icon: '🚀', description: 'Modern static builder' },
    { id: 'solid', name: 'SolidJS', icon: '🔷', description: 'Reactive framework' },
  ];

  const handleAddApiKey = () => {
    if (!newApiKey.provider || !newApiKey.key) {
      toast.error('Please select a provider and enter an API key');
      return;
    }

    try {
      addAPIKey({
        provider: newApiKey.provider,
        key: newApiKey.key,
        isActive: true,
      });
      
      setNewApiKey({ provider: '', key: '' });
      toast.success('API key added successfully!');
    } catch (error) {
      toast.error('Failed to add API key. Please check the format.');
    }
  };

  const handleConnectDeployment = () => {
    if (!newDeploymentCreds.provider) {
      toast.error('Please select a deployment provider');
      return;
    }

    connectDeploymentProvider(newDeploymentCreds.provider, {
      apiKey: newDeploymentCreds.apiKey,
      username: newDeploymentCreds.username,
    });

    setNewDeploymentCreds({ provider: '', apiKey: '', username: '' });
    toast.success('Deployment provider connected successfully!');
  };

  const handleLanguageChange = (languageCode: string) => {
    updateUserSettings({ language: languageCode });
    toast.success(`Language changed to ${languages.find(l => l.code === languageCode)?.name}`);
    document.documentElement.lang = languageCode;
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
    updateUserSettings({ theme: newTheme });
    toast.success(`Theme changed to ${newTheme}`);
  };

  const renderAPIKeysSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">AI Model API Keys</h3>
        <p className="text-dark-400 text-sm">
          Securely store your AI model API keys. All keys are encrypted and stored locally with enterprise-grade security.
        </p>
      </div>

      {/* Add New API Key */}
      <motion.div
        className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-600/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h4 className="font-medium text-white mb-4 flex items-center">
          <Plus className="w-4 h-4 mr-2 text-primary-400" />
          Add New API Key
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">AI Provider</label>
            <select
              value={newApiKey.provider}
              onChange={(e) => setNewApiKey(prev => ({ ...prev, provider: e.target.value }))}
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="">Select Provider</option>
              {AI_PROVIDERS.map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.icon} {provider.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <Input
              label="API Key"
              type="password"
              value={newApiKey.key}
              onChange={(e) => setNewApiKey(prev => ({ ...prev, key: e.target.value }))}
              placeholder="Enter your API key"
            />
          </div>
        </div>
        
        <Button
          onClick={handleAddApiKey}
          className="mt-4"
          disabled={!newApiKey.provider || !newApiKey.key}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add API Key
        </Button>
      </motion.div>

      {/* Available Providers with Models */}
      <div className="space-y-3">
        <h4 className="font-medium text-white">Available AI Providers ({AI_PROVIDERS.length})</h4>
        
        <div className="space-y-3">
          {AI_PROVIDERS.map(provider => {
            const hasApiKey = apiKeys.some(key => key.provider === provider.id);
            const isExpanded = expandedProvider === provider.id;
            
            return (
              <motion.div
                key={provider.id}
                className={`bg-dark-800/50 backdrop-blur-sm rounded-xl border transition-all duration-200 ${
                  hasApiKey ? 'border-success-500/30 bg-success-500/5' : 'border-dark-600/50 hover:border-dark-500/50'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
              >
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedProvider(isExpanded ? null : provider.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{provider.icon}</div>
                      <div>
                        <div className="font-medium text-white flex items-center space-x-2">
                          <span>{provider.name}</span>
                          {hasApiKey && (
                            <div className="w-2 h-2 bg-success-500 rounded-full" />
                          )}
                        </div>
                        <div className="text-sm text-dark-400">
                          {provider.models.length} models available
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {provider.signupUrl && (
                        <a
                          href={provider.signupUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-400 hover:text-accent-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {hasApiKey ? (
                        <span className="px-2 py-1 bg-success-500/20 text-success-400 text-xs rounded-full">
                          Connected
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-dark-600/50 text-dark-400 text-xs rounded-full">
                          Not connected
                        </span>
                      )}
                      <ChevronDown className={`w-4 h-4 text-dark-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-dark-700/50"
                    >
                      <div className="p-4">
                        <div className="text-sm text-dark-300 mb-3">Available Models:</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                          {provider.models.map(model => (
                            <div
                              key={model.id}
                              className="p-3 bg-dark-700/30 rounded-lg border border-dark-600/30"
                            >
                              <div className="font-medium text-white text-sm">{model.name}</div>
                              <div className="text-xs text-dark-400 mt-1">{model.description}</div>
                              {model.maxTokens && (
                                <div className="text-xs text-primary-400 mt-1">
                                  {model.maxTokens.toLocaleString()} tokens
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {provider.signupUrl && (
                          <div className="mt-3 pt-3 border-t border-dark-700/50">
                            <a
                              href={provider.signupUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary-400 hover:text-primary-300 flex items-center space-x-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Get API Key from {provider.name}</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Configured API Keys */}
      <div className="space-y-3">
        <h4 className="font-medium text-white">Configured API Keys ({apiKeys.length})</h4>
        
        {apiKeys.length === 0 ? (
          <div className="text-center py-8 text-dark-400 bg-dark-800/30 rounded-xl border border-dark-700/50">
            <Key className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No API keys configured</p>
            <p className="text-sm mt-1">Add your first API key to start using AI models</p>
          </div>
        ) : (
          <div className="space-y-3">
            {apiKeys.map(apiKey => {
              const provider = AI_PROVIDERS.find(p => p.id === apiKey.provider);
              return (
                <motion.div
                  key={apiKey.id}
                  className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-4 border border-dark-600/50 hover:border-dark-500/50 transition-all duration-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary-600/20 rounded-lg">
                        <Key className="w-4 h-4 text-primary-400" />
                      </div>
                      <div>
                        <div className="font-medium text-white flex items-center space-x-2">
                          <span>{provider?.icon}</span>
                          <span className="capitalize">{provider?.name || apiKey.provider}</span>
                          {apiKey.isActive && (
                            <div className="w-2 h-2 bg-success-500 rounded-full" />
                          )}
                        </div>
                        <div className="text-sm text-dark-400">
                          Added {apiKey.createdAt.toLocaleDateString()}
                          {apiKey.lastUsed && (
                            <span> • Last used {apiKey.lastUsed.toLocaleDateString()}</span>
                          )}
                        </div>
                        <div className="text-xs text-dark-500 mt-1">
                          Usage: {apiKey.usageCount} requests
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowApiKey(showApiKey === apiKey.id ? null : apiKey.id)}
                        className="p-2"
                      >
                        {showApiKey === apiKey.id ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to remove this API key?')) {
                            removeAPIKey(apiKey.id);
                            toast.success('API key removed');
                          }
                        }}
                        className="p-2 text-error-400 hover:text-error-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {showApiKey === apiKey.id && (
                    <motion.div
                      className="mt-3 p-3 bg-dark-700/50 rounded-lg border border-dark-600/50"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="text-sm text-dark-300 font-mono break-all">
                        {SecurityManager.decrypt(apiKey.key)}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Appearance Settings</h3>
        <p className="text-dark-400 text-sm">
          Customize the look and feel of ApporWebs to match your preferences.
        </p>
      </div>

      {/* Theme Selection */}
      <motion.div
        className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-600/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h4 className="font-medium text-white mb-4">Theme</h4>
        
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'light', name: 'Light', icon: Sun, preview: 'bg-gray-100' },
            { id: 'dark', name: 'Dark', icon: Moon, preview: 'bg-dark-900' },
            { id: 'auto', name: 'Auto', icon: Monitor, preview: 'bg-gradient-to-r from-gray-100 to-dark-900' },
          ].map((themeOption) => (
            <motion.button
              key={themeOption.id}
              onClick={() => handleThemeChange(themeOption.id as any)}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                theme === themeOption.id
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-dark-600 hover:border-dark-500'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-full h-16 rounded-lg mb-3 ${themeOption.preview}`} />
              <div className="flex items-center justify-center space-x-2">
                <themeOption.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{themeOption.name}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Framework Selection */}
      <motion.div
        className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-600/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h4 className="font-medium text-white mb-4">Preferred Frameworks</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {frameworks.map((framework) => (
            <motion.button
              key={framework.id}
              onClick={() => {
                updateUserSettings({ preferredFramework: framework.id });
                toast.success(`${framework.name} set as preferred framework`);
              }}
              className={`p-3 rounded-xl border transition-all duration-200 ${
                userSettings.preferredFramework === framework.id
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-dark-600 hover:border-dark-500'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl mb-2">{framework.icon}</div>
              <div className="text-sm font-medium text-white">{framework.name}</div>
              <div className="text-xs text-dark-400 mt-1">{framework.description}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Editor Settings */}
      <motion.div
        className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-600/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h4 className="font-medium text-white mb-4">Editor Settings</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">Font Size</label>
            <input
              type="range"
              min="10"
              max="24"
              value={userSettings.fontSize}
              onChange={(e) => updateUserSettings({ fontSize: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-dark-400 mt-1">{userSettings.fontSize}px</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">Tab Size</label>
            <select
              value={userSettings.tabSize}
              onChange={(e) => updateUserSettings({ tabSize: parseInt(e.target.value) })}
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>8 spaces</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          {[
            { key: 'wordWrap', label: 'Word Wrap', description: 'Wrap long lines in the editor' },
            { key: 'minimap', label: 'Minimap', description: 'Show code minimap on the right' },
            { key: 'lineNumbers', label: 'Line Numbers', description: 'Display line numbers' },
            { key: 'bracketPairColorization', label: 'Bracket Colorization', description: 'Color matching brackets' },
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">{setting.label}</div>
                <div className="text-xs text-dark-400">{setting.description}</div>
              </div>
              <input
                type="checkbox"
                checked={userSettings[setting.key as keyof typeof userSettings] as boolean}
                onChange={(e) => updateUserSettings({ [setting.key]: e.target.checked })}
                className="rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderLanguageSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Language Settings</h3>
        <p className="text-dark-400 text-sm">
          Configure interface language and regional preferences.
        </p>
      </div>

      <motion.div
        className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-600/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h4 className="font-medium text-white mb-4">Interface Language</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {languages.map((language) => (
            <motion.button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                userSettings.language === language.code
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-dark-600 hover:border-dark-500'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{language.flag}</span>
                <div className="text-left">
                  <div className="font-medium text-white">{language.name}</div>
                  <div className="text-xs text-dark-400">{language.code.toUpperCase()}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-primary-400">Language Support</div>
              <div className="text-xs text-dark-300 mt-1">
                Full interface translation is in development. Currently, language selection affects date formats and regional settings.
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Privacy & Security</h3>
        <p className="text-dark-400 text-sm">
          Configure security settings and privacy preferences for your ApporWebs experience.
        </p>
      </div>

      {/* Security Settings */}
      <motion.div
        className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-600/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h4 className="font-medium text-white mb-4 flex items-center">
          <Shield className="w-4 h-4 mr-2 text-primary-400" />
          Security Settings
        </h4>
        
        <div className="space-y-4">
          {[
            { 
              key: 'encryptionEnabled', 
              label: 'Data Encryption', 
              description: 'Encrypt all stored data with AES-256',
              icon: Shield
            },
            { 
              key: 'auditLog', 
              label: 'Audit Logging', 
              description: 'Log all security-related events',
              icon: Eye
            },
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-4 bg-dark-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <setting.icon className="w-5 h-5 text-primary-400" />
                <div>
                  <div className="text-sm font-medium text-white">{setting.label}</div>
                  <div className="text-xs text-dark-400">{setting.description}</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={securitySettings[setting.key as keyof typeof securitySettings] as boolean}
                onChange={(e) => updateSecuritySettings({ [setting.key]: e.target.checked })}
                className="rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500"
              />
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-dark-200 mb-2">Session Timeout</label>
          <select
            value={securitySettings.sessionTimeout / (60 * 60 * 1000)}
            onChange={(e) => updateSecuritySettings({ sessionTimeout: parseInt(e.target.value) * 60 * 60 * 1000 })}
            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
          >
            <option value={1}>1 hour</option>
            <option value={8}>8 hours</option>
            <option value={24}>24 hours</option>
            <option value={168}>1 week</option>
          </select>
        </div>
      </motion.div>

      {/* Privacy Settings */}
      <motion.div
        className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-600/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h4 className="font-medium text-white mb-4">Privacy Preferences</h4>
        
        <div className="space-y-4">
          {[
            { key: 'analytics', label: 'Usage Analytics', description: 'Help improve ApporWebs by sharing anonymous usage data' },
            { key: 'notifications', label: 'Notifications', description: 'Receive updates and notifications' },
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">{setting.label}</div>
                <div className="text-xs text-dark-400">{setting.description}</div>
              </div>
              <input
                type="checkbox"
                checked={userSettings[setting.key as keyof typeof userSettings] as boolean}
                onChange={(e) => updateUserSettings({ [setting.key]: e.target.checked })}
                className="rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderPerformanceSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Performance Settings</h3>
        <p className="text-dark-400 text-sm">
          Optimize ApporWebs performance for your system and usage patterns.
        </p>
      </div>

      <motion.div
        className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-600/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h4 className="font-medium text-white mb-4 flex items-center">
          <Zap className="w-4 h-4 mr-2 text-accent-400" />
          Performance Optimizations
        </h4>
        
        <div className="space-y-4">
          {[
            { key: 'cacheEnabled', label: 'Smart Caching', description: 'Cache AI responses and resources for faster loading' },
            { key: 'preloadModels', label: 'Preload Models', description: 'Preload AI models for instant responses' },
            { key: 'lazyLoading', label: 'Lazy Loading', description: 'Load components only when needed' },
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">{setting.label}</div>
                <div className="text-xs text-dark-400">{setting.description}</div>
              </div>
              <input
                type="checkbox"
                checked={performanceSettings[setting.key as keyof typeof performanceSettings] as boolean}
                onChange={(e) => updatePerformanceSettings({ [setting.key]: e.target.checked })}
                className="rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500"
              />
            </div>
          ))}
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">Max Concurrent Requests</label>
            <input
              type="range"
              min="1"
              max="10"
              value={performanceSettings.maxConcurrentRequests}
              onChange={(e) => updatePerformanceSettings({ maxConcurrentRequests: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-dark-400 mt-1">{performanceSettings.maxConcurrentRequests} requests</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">Request Timeout</label>
            <select
              value={performanceSettings.requestTimeout / 1000}
              onChange={(e) => updatePerformanceSettings({ requestTimeout: parseInt(e.target.value) * 1000 })}
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
            >
              <option value={10}>10 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={120}>2 minutes</option>
            </select>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderDeploymentSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Deployment Providers</h3>
        <p className="text-dark-400 text-sm">
          Connect your deployment services to deploy projects directly from ApporWebs.
        </p>
      </div>

      {/* Add New Deployment Provider */}
      <motion.div
        className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-600/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h4 className="font-medium text-white mb-4 flex items-center">
          <Plus className="w-4 h-4 mr-2 text-primary-400" />
          Connect Deployment Provider
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">Provider</label>
            <select
              value={newDeploymentCreds.provider}
              onChange={(e) => setNewDeploymentCreds(prev => ({ ...prev, provider: e.target.value }))}
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="">Select Provider</option>
              {DEPLOYMENT_PROVIDERS.map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.icon} {provider.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <Input
              label="API Key / Token"
              type="password"
              value={newDeploymentCreds.apiKey}
              onChange={(e) => setNewDeploymentCreds(prev => ({ ...prev, apiKey: e.target.value }))}
              placeholder="Enter API key"
            />
          </div>
          
          <div>
            <Input
              label="Username (optional)"
              value={newDeploymentCreds.username}
              onChange={(e) => setNewDeploymentCreds(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Enter username"
            />
          </div>
        </div>
        
        <Button
          onClick={handleConnectDeployment}
          className="mt-4"
          disabled={!newDeploymentCreds.provider}
        >
          <Plus className="w-4 h-4 mr-2" />
          Connect Provider
        </Button>
      </motion.div>

      {/* Connected Providers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deploymentProviders.map(provider => (
          <motion.div
            key={provider.id}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              provider.connected
                ? 'bg-success-500/10 border-success-500/30'
                : 'bg-dark-800/50 border-dark-600/50 hover:border-dark-500/50'
            }`}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{provider.icon}</div>
                <div>
                  <div className="font-medium text-white">{provider.name}</div>
                  <div className={`text-sm ${
                    provider.connected ? 'text-success-400' : 'text-dark-400'
                  }`}>
                    {provider.connected ? 'Connected' : 'Not connected'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {provider.signupUrl && (
                  <a
                    href={provider.signupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-400 hover:text-accent-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {provider.connected ? (
                  <Check className="w-5 h-5 text-success-500" />
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setNewDeploymentCreds(prev => ({ ...prev, provider: provider.id }))}
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>
            
            <div className="text-xs text-dark-400 mb-2">{provider.description}</div>
            
            {provider.connected && provider.lastDeployment && (
              <div className="text-xs text-dark-400">
                Last deployment: {provider.lastDeployment.toLocaleDateString()}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'api-keys': return renderAPIKeysSection();
      case 'deployment': return renderDeploymentSection();
      case 'appearance': return renderAppearanceSection();
      case 'language': return renderLanguageSection();
      case 'privacy': return renderPrivacySection();
      case 'performance': return renderPerformanceSection();
      default: return null;
    }
  };

  return (
    <div className="flex h-full bg-dark-950/50">
      {/* Settings Sidebar */}
      <div className="w-64 sm:w-72 bg-dark-900/90 backdrop-blur-sm border-r border-dark-700/50 p-4 overflow-y-auto">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl shadow-lg">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Settings</h3>
            <p className="text-sm text-dark-400">Configure ApporWebs</p>
          </div>
        </div>

        <nav className="space-y-2">
          {sections.map((section) => (
            <motion.button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 text-left ${
                activeSection === section.id
                  ? 'bg-gradient-to-r from-primary-600/20 to-accent-600/20 border border-primary-500/30 text-primary-400'
                  : 'hover:bg-dark-700/50 text-dark-300 hover:text-white border border-transparent'
              }`}
              whileHover={{ scale: 1.01, x: 2 }}
              whileTap={{ scale: 0.99 }}
            >
              <section.icon className="w-5 h-5 flex-shrink-0" />
              <div className="ml-3 flex-1 min-w-0">
                <div className="font-medium text-sm">{section.label}</div>
                <div className="text-xs text-dark-400 truncate">{section.description}</div>
              </div>
            </motion.button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};