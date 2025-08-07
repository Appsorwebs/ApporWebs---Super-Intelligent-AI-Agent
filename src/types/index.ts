export interface Project {
  id: string;
  name: string;
  description: string;
  files: ProjectFile[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  tags: string[];
  framework: string;
  language: string;
  deploymentUrl?: string;
  githubRepo?: string;
  lastDeployment?: Date;
  buildStatus?: 'idle' | 'building' | 'success' | 'error';
  buildProgress?: number;
  buildLogs?: string[];
}

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  type: 'file' | 'folder';
  size: number;
  lastModified: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  type?: 'text' | 'code' | 'image' | 'error';
  metadata?: {
    language?: string;
    model?: string;
    tokens?: number;
    executionTime?: number;
  };
}

export interface AIProvider {
  id: string;
  name: string;
  models: AIModel[];
  apiKeyRequired: boolean;
  capabilities: AICapability[];
  baseUrl?: string;
  signupUrl?: string;
  icon: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  type: 'text' | 'code' | 'image' | 'multimodal' | 'embedding' | 'audio' | 'video';
  maxTokens?: number;
  costPer1k?: number;
  description: string;
}

export interface AICapability {
  type: 'code-generation' | 'text-generation' | 'image-generation' | 'video-generation' | 'debugging' | 'optimization';
  languages?: string[];
  frameworks?: string[];
}

export interface APIKey {
  id: string;
  provider: string;
  key: string;
  isActive: boolean;
  createdAt: Date;
  lastUsed?: Date;
  usageCount: number;
}

export interface DeploymentProvider {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  apiKey?: string;
  username?: string;
  lastDeployment?: Date;
  signupUrl?: string;
  description?: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  autoSave: boolean;
  codeCompletion: boolean;
  livePreview: boolean;
  notifications: boolean;
  analytics: boolean;
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  lineNumbers: boolean;
  bracketPairColorization: boolean;
  preferredFramework?: string;
}

export interface SecuritySettings {
  encryptionEnabled: boolean;
  sessionTimeout: number;
  twoFactorAuth: boolean;
  ipWhitelist: string[];
  auditLog: boolean;
}

export interface PerformanceSettings {
  cacheEnabled: boolean;
  preloadModels: boolean;
  maxConcurrentRequests: number;
  requestTimeout: number;
  compressionLevel: number;
  lazyLoading: boolean;
}

export type Theme = 'light' | 'dark' | 'auto';

export interface AppState {
  theme: Theme;
  currentProject: Project | null;
  projects: Project[];
  chatMessages: ChatMessage[];
  apiKeys: APIKey[];
  selectedModel: string;
  isGenerating: boolean;
  deploymentProviders: DeploymentProvider[];
  userSettings: UserSettings;
  securitySettings: SecuritySettings;
  performanceSettings: PerformanceSettings;
  isOnline: boolean;
  lastSaved: Date | null;
}

export interface BuildProgress {
  stage: string;
  progress: number;
  message: string;
  timestamp: Date;
}

export interface DeploymentResult {
  success: boolean;
  url?: string;
  error?: string;
  buildTime?: number;
  deploymentId?: string;
}