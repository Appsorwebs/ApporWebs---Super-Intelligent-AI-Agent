import { AIProvider } from '../types';

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🤖',
    apiKeyRequired: true,
    baseUrl: 'https://api.openai.com/v1',
    signupUrl: 'https://platform.openai.com/signup',
    models: [
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', type: 'text', maxTokens: 16385, costPer1k: 0.0015, description: 'Fast, lightweight, used in free tier' },
      { id: 'gpt-4', name: 'GPT-4.0', provider: 'openai', type: 'text', maxTokens: 8192, costPer1k: 0.03, description: 'Strong reasoning, coding, and instruction-following' },
      { id: 'gpt-4-turbo', name: 'GPT-4.1', provider: 'openai', type: 'text', maxTokens: 128000, costPer1k: 0.01, description: 'Strong reasoning, coding, and instruction-following' },
      { id: 'gpt-4.5-preview', name: 'GPT-4.5 (Preview)', provider: 'openai', type: 'text', maxTokens: 128000, costPer1k: 0.015, description: 'Largest model yet, improved creativity and tone control' },
      { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', type: 'multimodal', maxTokens: 128000, costPer1k: 0.005, description: 'Multimodal (text, image, audio), real-time interaction' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', type: 'text', maxTokens: 128000, costPer1k: 0.00015, description: 'Efficient fallback model for free users' },
      { id: 'dall-e-3', name: 'DALL-E 3', provider: 'openai', type: 'image', description: 'Advanced image generation' },
      { id: 'dall-e-2', name: 'DALL-E 2', provider: 'openai', type: 'image', description: 'High-quality image generation' },
      { id: 'whisper-1', name: 'Whisper', provider: 'openai', type: 'audio', description: 'Speech-to-text model' },
      { id: 'tts-1', name: 'TTS-1', provider: 'openai', type: 'audio', description: 'Text-to-speech model' },
      { id: 'tts-1-hd', name: 'TTS-1 HD', provider: 'openai', type: 'audio', description: 'High-definition text-to-speech' }
    ],
    capabilities: [
      { type: 'code-generation', languages: ['javascript', 'python', 'typescript', 'java', 'go', 'rust', 'c++', 'c#', 'php', 'ruby'] },
      { type: 'text-generation' },
      { type: 'image-generation' },
      { type: 'debugging' },
      { type: 'optimization' }
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    icon: '🧠',
    apiKeyRequired: true,
    baseUrl: 'https://api.anthropic.com/v1',
    signupUrl: 'https://console.anthropic.com/',
    models: [
      { id: 'claude-3.5-haiku', name: 'Claude 3.5 Haiku', provider: 'anthropic', type: 'text', maxTokens: 200000, costPer1k: 0.00025, description: 'Fastest model, optimized for edge/local use' },
      { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'anthropic', type: 'text', maxTokens: 200000, costPer1k: 0.003, description: 'Balanced performance, strong reasoning' },
      { id: 'claude-3.7-sonnet', name: 'Claude 3.7 Sonnet', provider: 'anthropic', type: 'text', maxTokens: 200000, costPer1k: 0.003, description: 'Hybrid reasoning model with extended thinking' },
      { id: 'claude-4-opus', name: 'Claude 4 Opus', provider: 'anthropic', type: 'text', maxTokens: 200000, costPer1k: 0.015, description: 'Most powerful model, excels in coding, math, and science' },
      { id: 'claude-4-sonnet', name: 'Claude 4 Sonnet', provider: 'anthropic', type: 'multimodal', maxTokens: 200000, costPer1k: 0.003, description: 'High-performance model with image understanding' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'anthropic', type: 'text', maxTokens: 200000, costPer1k: 0.015, description: 'Most powerful Claude 3' },
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', provider: 'anthropic', type: 'text', maxTokens: 200000, costPer1k: 0.003, description: 'Balanced Claude 3' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'anthropic', type: 'text', maxTokens: 200000, costPer1k: 0.00025, description: 'Fast Claude 3' }
    ],
    capabilities: [
      { type: 'code-generation', languages: ['javascript', 'python', 'typescript', 'java', 'go', 'rust', 'c++', 'c#', 'php', 'ruby', 'swift', 'kotlin'] },
      { type: 'text-generation' },
      { type: 'debugging' },
      { type: 'optimization' }
    ]
  },
  {
    id: 'google',
    name: 'Google AI',
    icon: '🔍',
    apiKeyRequired: true,
    baseUrl: 'https://generativelanguage.googleapis.com/v1',
    signupUrl: 'https://makersuite.google.com/app/apikey',
    models: [
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'google', type: 'multimodal', maxTokens: 2097152, costPer1k: 0.00125, description: 'Long-context multimodal model (video, code, audio)' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'google', type: 'multimodal', maxTokens: 1048576, costPer1k: 0.0005, description: 'Real-time streaming, 1M token context window' },
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'google', type: 'multimodal', maxTokens: 2097152, costPer1k: 0.00125, description: 'Advanced reasoning, multimodal input/output' },
      { id: 'gemini-2.5-flash-native-audio', name: 'Gemini 2.5 Flash Native Audio', provider: 'google', type: 'multimodal', maxTokens: 1048576, costPer1k: 0.0005, description: 'Natural conversational audio output' },
      { id: 'gemini-2.5-tts', name: 'Gemini 2.5 TTS', provider: 'google', type: 'audio', description: 'Multi-speaker, controllable text-to-speech' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'google', type: 'multimodal', maxTokens: 1048576, costPer1k: 0.000075, description: 'Fast Gemini model' },
      { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash 8B', provider: 'google', type: 'multimodal', maxTokens: 1048576, costPer1k: 0.0000375, description: 'Efficient 8B model' },
      { id: 'gemini-pro', name: 'Gemini Pro', provider: 'google', type: 'multimodal', maxTokens: 32768, costPer1k: 0.0005, description: 'Standard Gemini Pro' },
      { id: 'gemini-pro-vision', name: 'Gemini Pro Vision', provider: 'google', type: 'multimodal', description: 'Vision-enabled Gemini' }
    ],
    capabilities: [
      { type: 'code-generation', languages: ['javascript', 'python', 'typescript', 'java', 'go', 'kotlin', 'swift'] },
      { type: 'text-generation' },
      { type: 'debugging' },
      { type: 'image-generation' }
    ]
  },
  {
    id: 'meta',
    name: 'Meta AI',
    icon: '🦙',
    apiKeyRequired: true,
    baseUrl: 'https://api.llama-api.com/v1',
    signupUrl: 'https://llama.meta.com/',
    models: [
      { id: 'llama-3.1-8b', name: 'LLaMA 3.1 8B', provider: 'meta', type: 'text', maxTokens: 131072, costPer1k: 0.0002, description: 'Multilingual, long-context, open-weight' },
      { id: 'llama-3.1-70b', name: 'LLaMA 3.1 70B', provider: 'meta', type: 'text', maxTokens: 131072, costPer1k: 0.002, description: 'Multilingual, long-context, open-weight' },
      { id: 'llama-3.1-405b', name: 'LLaMA 3.1 405B', provider: 'meta', type: 'text', maxTokens: 131072, costPer1k: 0.01, description: 'Multilingual, long-context, open-weight' },
      { id: 'llama-4-scout', name: 'LLaMA 4 Scout', provider: 'meta', type: 'multimodal', maxTokens: 10485760, costPer1k: 0.005, description: '10M token context, efficient multimodal reasoning' },
      { id: 'llama-4-maverick', name: 'LLaMA 4 Maverick', provider: 'meta', type: 'text', maxTokens: 1048576, costPer1k: 0.003, description: '1M token context, fast and balanced performance' },
      { id: 'llama-4-behemoth-beta', name: 'LLaMA 4 Behemoth (Beta)', provider: 'meta', type: 'text', maxTokens: 131072, costPer1k: 0.02, description: '2T parameters, teacher model for distillation' },
      { id: 'code-llama-34b', name: 'Code Llama 34B', provider: 'meta', type: 'code', maxTokens: 16384, description: 'Code-specialized Llama' }
    ],
    capabilities: [
      { type: 'code-generation', languages: ['javascript', 'python', 'typescript', 'java', 'c++', 'rust', 'go'] },
      { type: 'text-generation' }
    ]
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    icon: '🌪️',
    apiKeyRequired: true,
    baseUrl: 'https://api.mistral.ai/v1',
    signupUrl: 'https://console.mistral.ai/',
    models: [
      { id: 'mistral-small-3.1', name: 'Mistral Small 3.1', provider: 'mistral', type: 'text', maxTokens: 32768, description: 'Open-weight, image understanding, fast inference' },
      { id: 'mistral-small-3.2', name: 'Mistral Small 3.2', provider: 'mistral', type: 'text', maxTokens: 32768, description: 'Open-weight, image understanding, fast inference' },
      { id: 'magistral-small', name: 'Magistral Small', provider: 'mistral', type: 'text', maxTokens: 32768, description: 'Reasoning-focused models with step-by-step logic' },
      { id: 'magistral-medium', name: 'Magistral Medium', provider: 'mistral', type: 'text', maxTokens: 32768, description: 'Reasoning-focused models with step-by-step logic' },
      { id: 'codestral-2', name: 'Codestral 2', provider: 'mistral', type: 'code', maxTokens: 32768, description: 'Code-specialized model with fill-in-the-middle and test generation' },
      { id: 'pixtral-large', name: 'Pixtral Large', provider: 'mistral', type: 'multimodal', maxTokens: 128000, description: 'Multimodal model for document and image analysis' },
      { id: 'voxtral-small', name: 'Voxtral Small', provider: 'mistral', type: 'audio', description: 'Open-source audio models for transcription and voice understanding' },
      { id: 'voxtral-mini', name: 'Voxtral Mini', provider: 'mistral', type: 'audio', description: 'Open-source audio models for transcription and voice understanding' },
      { id: 'mistral-large-latest', name: 'Mistral Large Latest', provider: 'mistral', type: 'text', maxTokens: 128000, description: 'Latest large model' },
      { id: 'mixtral-8x7b-instruct', name: 'Mixtral 8x7B', provider: 'mistral', type: 'text', maxTokens: 32768, description: 'Mixture of experts model' }
    ],
    capabilities: [
      { type: 'code-generation', languages: ['javascript', 'python', 'typescript', 'java'] },
      { type: 'text-generation' },
      { type: 'debugging' }
    ]
  },
  {
    id: 'xai',
    name: 'xAI (Grok)',
    icon: '🚀',
    apiKeyRequired: true,
    baseUrl: 'https://api.x.ai/v1',
    signupUrl: 'https://console.x.ai/',
    models: [
      { id: 'grok-4', name: 'Grok-4', provider: 'xai', type: 'text', maxTokens: 131072, costPer1k: 0.01, description: 'Most advanced Grok model' },
      { id: 'grok-3-fast', name: 'Grok-3 Fast', provider: 'xai', type: 'text', maxTokens: 131072, costPer1k: 0.005, description: 'Fast Grok-3 variant' },
      { id: 'grok-3', name: 'Grok-3', provider: 'xai', type: 'text', maxTokens: 131072, costPer1k: 0.008, description: 'Advanced reasoning model' },
      { id: 'grok-3-mini', name: 'Grok-3 Mini', provider: 'xai', type: 'text', maxTokens: 131072, costPer1k: 0.002, description: 'Compact Grok-3' },
      { id: 'grok-3-mini-latest', name: 'Grok-3 Mini Latest', provider: 'xai', type: 'text', maxTokens: 131072, costPer1k: 0.002, description: 'Latest Grok-3 Mini' },
      { id: 'grok-3-mini-fast', name: 'Grok-3 Mini Fast', provider: 'xai', type: 'text', maxTokens: 131072, costPer1k: 0.001, description: 'Fastest Grok-3 Mini' },
      { id: 'grok-3-mini-fast-latest', name: 'Grok-3 Mini Fast Latest', provider: 'xai', type: 'text', maxTokens: 131072, costPer1k: 0.001, description: 'Latest fast Mini' },
      { id: 'grok-2-vision-1212', name: 'Grok-2 Vision', provider: 'xai', type: 'multimodal', maxTokens: 131072, costPer1k: 0.006, description: 'Vision-enabled Grok-2' },
      { id: 'grok-2-1212', name: 'Grok-2', provider: 'xai', type: 'text', maxTokens: 131072, costPer1k: 0.005, description: 'Second-gen Grok model' },
      { id: 'grok-beta', name: 'Grok Beta', provider: 'xai', type: 'text', maxTokens: 131072, costPer1k: 0.005, description: 'Beta Grok model' }
    ],
    capabilities: [
      { type: 'code-generation', languages: ['javascript', 'python', 'typescript', 'java', 'go', 'rust', 'c++'] },
      { type: 'text-generation' },
      { type: 'debugging' },
      { type: 'optimization' }
    ]
  },
  {
    id: 'cohere',
    name: 'Cohere',
    icon: '🌐',
    apiKeyRequired: true,
    baseUrl: 'https://api.cohere.ai/v1',
    signupUrl: 'https://dashboard.cohere.ai/register',
    models: [
      { id: 'command-r-plus', name: 'Command R+', provider: 'cohere', type: 'text', maxTokens: 128000, description: 'Most capable Command model' },
      { id: 'command-r', name: 'Command R', provider: 'cohere', type: 'text', maxTokens: 128000, description: 'Balanced Command model' },
      { id: 'command', name: 'Command', provider: 'cohere', type: 'text', maxTokens: 4096, description: 'Instruction-following model' },
      { id: 'command-light', name: 'Command Light', provider: 'cohere', type: 'text', maxTokens: 4096, description: 'Faster Command model' },
      { id: 'command-nightly', name: 'Command Nightly', provider: 'cohere', type: 'text', maxTokens: 4096, description: 'Latest experimental Command' }
    ],
    capabilities: [
      { type: 'text-generation' },
      { type: 'code-generation', languages: ['javascript', 'python', 'java'] }
    ]
  },
  {
    id: 'stability',
    name: 'Stability AI',
    icon: '🎨',
    apiKeyRequired: true,
    baseUrl: 'https://api.stability.ai/v1',
    signupUrl: 'https://platform.stability.ai/',
    models: [
      { id: 'stable-diffusion-3-5-large', name: 'Stable Diffusion 3.5 Large', provider: 'stability', type: 'image', description: 'Latest large SD model' },
      { id: 'stable-diffusion-3-5-medium', name: 'Stable Diffusion 3.5 Medium', provider: 'stability', type: 'image', description: 'Balanced SD 3.5 model' },
      { id: 'stable-diffusion-3-medium', name: 'Stable Diffusion 3 Medium', provider: 'stability', type: 'image', description: 'SD 3 medium model' },
      { id: 'stable-diffusion-xl-1024-v1-0', name: 'Stable Diffusion XL', provider: 'stability', type: 'image', description: 'High-resolution image generation' },
      { id: 'stable-diffusion-v1-6', name: 'Stable Diffusion v1.6', provider: 'stability', type: 'image', description: 'Versatile image generation' },
      { id: 'stable-video-diffusion-img2vid-v1-1', name: 'Stable Video Diffusion', provider: 'stability', type: 'video', description: 'Image to video generation' }
    ],
    capabilities: [
      { type: 'image-generation' },
      { type: 'video-generation' }
    ]
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    icon: '🤗',
    apiKeyRequired: true,
    baseUrl: 'https://api-inference.huggingface.co',
    signupUrl: 'https://huggingface.co/join',
    models: [
      { id: 'meta-llama/Llama-3.3-70B-Instruct', name: 'Llama 3.3 70B Instruct', provider: 'huggingface', type: 'text', maxTokens: 131072, description: 'Latest Llama 3.3 model' },
      { id: 'meta-llama/Llama-3.2-90B-Vision-Instruct', name: 'Llama 3.2 90B Vision', provider: 'huggingface', type: 'multimodal', maxTokens: 131072, description: 'Vision-enabled Llama' },
      { id: 'meta-llama/CodeLlama-34b-Instruct-hf', name: 'CodeLlama 34B', provider: 'huggingface', type: 'code', maxTokens: 16384, description: 'Code-specialized Llama' },
      { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', name: 'Mixtral 8x7B', provider: 'huggingface', type: 'text', maxTokens: 32768, description: 'Mixture of experts model' },
      { id: 'microsoft/DialoGPT-large', name: 'DialoGPT Large', provider: 'huggingface', type: 'text', maxTokens: 1024, description: 'Conversational model' },
      { id: 'bigscience/bloom', name: 'BLOOM', provider: 'huggingface', type: 'text', maxTokens: 2048, description: 'Multilingual model' }
    ],
    capabilities: [
      { type: 'code-generation', languages: ['javascript', 'python', 'typescript', 'java', 'c++', 'rust', 'go'] },
      { type: 'text-generation' }
    ]
  },
  {
    id: 'replicate',
    name: 'Replicate',
    icon: '🔄',
    apiKeyRequired: true,
    baseUrl: 'https://api.replicate.com/v1',
    signupUrl: 'https://replicate.com/signin',
    models: [
      { id: 'meta/llama-2-70b-chat', name: 'Llama 2 70B Chat', provider: 'replicate', type: 'text', maxTokens: 4096, description: 'Chat-optimized Llama 2' },
      { id: 'stability-ai/sdxl', name: 'SDXL', provider: 'replicate', type: 'image', description: 'Stable Diffusion XL' },
      { id: 'meta/code-llama-34b-instruct', name: 'Code Llama 34B', provider: 'replicate', type: 'code', maxTokens: 16384, description: 'Code generation model' },
      { id: 'mistralai/mixtral-8x7b-instruct-v0.1', name: 'Mixtral 8x7B', provider: 'replicate', type: 'text', maxTokens: 32768, description: 'Mixture model' }
    ],
    capabilities: [
      { type: 'code-generation', languages: ['javascript', 'python', 'typescript'] },
      { type: 'text-generation' },
      { type: 'image-generation' }
    ]
  },
  {
    id: 'together',
    name: 'Together AI',
    icon: '🤝',
    apiKeyRequired: true,
    baseUrl: 'https://api.together.xyz/v1',
    signupUrl: 'https://api.together.xyz/signup',
    models: [
      { id: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo', name: 'Llama 3.1 405B Turbo', provider: 'together', type: 'text', maxTokens: 131072, description: 'Largest Llama model' },
      { id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', name: 'Llama 3.1 70B Turbo', provider: 'together', type: 'text', maxTokens: 131072, description: 'Fast Llama 3.1' },
      { id: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo', name: 'Llama 3.1 8B Turbo', provider: 'together', type: 'text', maxTokens: 131072, description: 'Efficient Llama 3.1' },
      { id: 'mistralai/Mixtral-8x22B-Instruct-v0.1', name: 'Mixtral 8x22B', provider: 'together', type: 'text', maxTokens: 65536, description: 'Large mixture model' },
      { id: 'Qwen/Qwen2.5-72B-Instruct-Turbo', name: 'Qwen 2.5 72B', provider: 'together', type: 'text', maxTokens: 32768, description: 'Advanced Qwen model' }
    ],
    capabilities: [
      { type: 'code-generation', languages: ['javascript', 'python', 'typescript', 'java', 'c++'] },
      { type: 'text-generation' }
    ]
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    icon: '🔍',
    apiKeyRequired: true,
    baseUrl: 'https://api.perplexity.ai',
    signupUrl: 'https://www.perplexity.ai/settings/api',
    models: [
      { id: 'llama-3.1-sonar-huge-128k-online', name: 'Llama 3.1 Sonar Huge Online', provider: 'perplexity', type: 'text', maxTokens: 127072, description: 'Largest online model' },
      { id: 'llama-3.1-sonar-large-128k-online', name: 'Llama 3.1 Sonar Large Online', provider: 'perplexity', type: 'text', maxTokens: 127072, description: 'Large online model' },
      { id: 'llama-3.1-sonar-small-128k-online', name: 'Llama 3.1 Sonar Small Online', provider: 'perplexity', type: 'text', maxTokens: 127072, description: 'Fast online model' },
      { id: 'llama-3.1-8b-instruct', name: 'Llama 3.1 8B Instruct', provider: 'perplexity', type: 'text', maxTokens: 131072, description: 'Efficient instruct model' },
      { id: 'llama-3.1-70b-instruct', name: 'Llama 3.1 70B Instruct', provider: 'perplexity', type: 'text', maxTokens: 131072, description: 'Large instruct model' }
    ],
    capabilities: [
      { type: 'text-generation' },
      { type: 'code-generation', languages: ['javascript', 'python', 'typescript'] }
    ]
  },
  {
    id: 'groq',
    name: 'Groq',
    icon: '⚡',
    apiKeyRequired: true,
    baseUrl: 'https://api.groq.com/openai/v1',
    signupUrl: 'https://console.groq.com/',
    models: [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile', provider: 'groq', type: 'text', maxTokens: 131072, description: 'Latest versatile Llama' },
      { id: 'llama-3.2-90b-vision-preview', name: 'Llama 3.2 90B Vision', provider: 'groq', type: 'multimodal', maxTokens: 131072, description: 'Vision-enabled Llama' },
      { id: 'llama3-groq-70b-8192-tool-use-preview', name: 'Llama 3 70B Tool Use', provider: 'groq', type: 'text', maxTokens: 8192, description: 'Tool-use optimized' },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', provider: 'groq', type: 'text', maxTokens: 32768, description: 'Ultra-fast Mixtral' },
      { id: 'gemma2-9b-it', name: 'Gemma 2 9B', provider: 'groq', type: 'text', maxTokens: 8192, description: 'Google Gemma model' }
    ],
    capabilities: [
      { type: 'code-generation', languages: ['javascript', 'python', 'typescript', 'java'] },
      { type: 'text-generation' }
    ]
  },
  {
    id: 'fireworks',
    name: 'Fireworks AI',
    icon: '🎆',
    apiKeyRequired: true,
    baseUrl: 'https://api.fireworks.ai/inference/v1',
    signupUrl: 'https://fireworks.ai/login',
    models: [
      { id: 'accounts/fireworks/models/llama-v3p1-405b-instruct', name: 'Llama 3.1 405B', provider: 'fireworks', type: 'text', maxTokens: 131072, description: 'Largest Llama on Fireworks' },
      { id: 'accounts/fireworks/models/llama-v3p1-70b-instruct', name: 'Llama 3.1 70B', provider: 'fireworks', type: 'text', maxTokens: 131072, description: 'High-performance Llama' },
      { id: 'accounts/fireworks/models/mixtral-8x7b-instruct', name: 'Mixtral 8x7B', provider: 'fireworks', type: 'text', maxTokens: 32768, description: 'Fast mixture model' },
      { id: 'accounts/fireworks/models/qwen2p5-72b-instruct', name: 'Qwen 2.5 72B', provider: 'fireworks', type: 'text', maxTokens: 32768, description: 'Advanced Qwen model' }
    ],
    capabilities: [
      { type: 'code-generation', languages: ['javascript', 'python', 'typescript'] },
      { type: 'text-generation' }
    ]
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: '🔬',
    apiKeyRequired: true,
    baseUrl: 'https://api.deepseek.com/v1',
    signupUrl: 'https://platform.deepseek.com/',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat', provider: 'deepseek', type: 'text', maxTokens: 64000, description: 'Advanced chat model' },
      { id: 'deepseek-coder', name: 'DeepSeek Coder', provider: 'deepseek', type: 'code', maxTokens: 64000, description: 'Specialized coding model' },
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', provider: 'deepseek', type: 'text', maxTokens: 64000, description: 'Reasoning-focused model' }
    ],
    capabilities: [
      { type: 'code-generation', languages: ['javascript', 'python', 'typescript', 'java', 'c++', 'go', 'rust'] },
      { type: 'text-generation' },
      { type: 'debugging' }
    ]
  },
  {
    id: 'ai21',
    name: 'AI21 Labs',
    icon: '🧪',
    apiKeyRequired: true,
    baseUrl: 'https://api.ai21.com/studio/v1',
    signupUrl: 'https://studio.ai21.com/',
    models: [
      { id: 'jamba-1.5-large', name: 'Jamba 1.5 Large', provider: 'ai21', type: 'text', maxTokens: 256000, description: 'Latest Jamba model' },
      { id: 'jamba-1.5-mini', name: 'Jamba 1.5 Mini', provider: 'ai21', type: 'text', maxTokens: 256000, description: 'Efficient Jamba model' },
      { id: 'j2-ultra', name: 'Jurassic-2 Ultra', provider: 'ai21', type: 'text', maxTokens: 8192, description: 'Most capable Jurassic' },
      { id: 'j2-mid', name: 'Jurassic-2 Mid', provider: 'ai21', type: 'text', maxTokens: 8192, description: 'Balanced Jurassic' },
      { id: 'j2-light', name: 'Jurassic-2 Light', provider: 'ai21', type: 'text', maxTokens: 8192, description: 'Fast Jurassic model' }
    ],
    capabilities: [
      { type: 'text-generation' },
      { type: 'code-generation', languages: ['javascript', 'python'] }
    ]
  },
  {
    id: 'voyage',
    name: 'Voyage AI',
    icon: '🚀',
    apiKeyRequired: true,
    baseUrl: 'https://api.voyageai.com/v1',
    signupUrl: 'https://dash.voyageai.com/',
    models: [
      { id: 'voyage-3', name: 'Voyage 3', provider: 'voyage', type: 'embedding', description: 'Latest embedding model' },
      { id: 'voyage-3-lite', name: 'Voyage 3 Lite', provider: 'voyage', type: 'embedding', description: 'Efficient embedding model' },
      { id: 'voyage-large-2-instruct', name: 'Voyage Large 2 Instruct', provider: 'voyage', type: 'embedding', description: 'Instruction-tuned embeddings' },
      { id: 'voyage-code-2', name: 'Voyage Code 2', provider: 'voyage', type: 'embedding', description: 'Code-specialized embeddings' },
      { id: 'voyage-finance-2', name: 'Voyage Finance 2', provider: 'voyage', type: 'embedding', description: 'Finance-specialized embeddings' }
    ],
    capabilities: [
      { type: 'code-generation', languages: ['javascript', 'python', 'typescript'] }
    ]
  }
];

export const getProviderById = (id: string): AIProvider | undefined => {
  return AI_PROVIDERS.find(provider => provider.id === id);
};

export const getModelById = (modelId: string): AIModel | undefined => {
  for (const provider of AI_PROVIDERS) {
    const model = provider.models.find(m => m.id === modelId);
    if (model) return model;
  }
  return undefined;
};