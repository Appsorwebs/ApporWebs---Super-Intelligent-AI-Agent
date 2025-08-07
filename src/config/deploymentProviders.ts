import { DeploymentProvider } from '../types';

export const DEPLOYMENT_PROVIDERS: DeploymentProvider[] = [
  {
    id: 'netlify',
    name: 'Netlify',
    icon: '🌐',
    connected: false,
    signupUrl: 'https://app.netlify.com/signup',
    description: 'Deploy static sites with continuous deployment'
  },
  {
    id: 'vercel',
    name: 'Vercel',
    icon: '▲',
    connected: false,
    signupUrl: 'https://vercel.com/signup',
    description: 'Frontend cloud platform for static sites and serverless functions'
  },
  {
    id: 'render',
    name: 'Render',
    icon: '🎨',
    connected: false,
    signupUrl: 'https://dashboard.render.com/register',
    description: 'Cloud platform for hosting web services, static sites, and databases'
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Pages',
    icon: '☁️',
    connected: false,
    signupUrl: 'https://dash.cloudflare.com/sign-up',
    description: 'Fast, secure, and free static site hosting'
  },
  {
    id: 'github',
    name: 'GitHub Pages',
    icon: '🐙',
    connected: false,
    signupUrl: 'https://github.com/join',
    description: 'Host static websites directly from GitHub repositories'
  },
  {
    id: 'supabase',
    name: 'Supabase',
    icon: '⚡',
    connected: false,
    signupUrl: 'https://supabase.com/dashboard/sign-up',
    description: 'Open source Firebase alternative with hosting'
  },
  {
    id: 'railway',
    name: 'Railway',
    icon: '🚂',
    connected: false,
    signupUrl: 'https://railway.app/login',
    description: 'Deploy and scale applications with zero configuration'
  },
  {
    id: 'heroku',
    name: 'Heroku',
    icon: '🟣',
    connected: false,
    signupUrl: 'https://signup.heroku.com/',
    description: 'Cloud platform for building, running, and scaling applications'
  },
  {
    id: 'expo',
    name: 'Expo',
    icon: '📱',
    connected: false,
    signupUrl: 'https://expo.dev/signup',
    description: 'Platform for universal React applications'
  },
  {
    id: 'firebase',
    name: 'Firebase Hosting',
    icon: '🔥',
    connected: false,
    signupUrl: 'https://console.firebase.google.com/',
    description: 'Google\'s web and mobile app development platform'
  },
  {
    id: 'aws',
    name: 'AWS Amplify',
    icon: '☁️',
    connected: false,
    signupUrl: 'https://aws.amazon.com/amplify/',
    description: 'Full-stack development platform by Amazon'
  },
  {
    id: 'azure',
    name: 'Azure Static Web Apps',
    icon: '🔷',
    connected: false,
    signupUrl: 'https://azure.microsoft.com/en-us/products/app-service/static/',
    description: 'Microsoft\'s static web app hosting service'
  }
];