import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <motion.footer
      className="py-2 sm:py-3 px-4 sm:px-6 border-t border-dark-700/50 bg-dark-900/50 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-dark-400 space-y-2 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
          <span>© 2024 ApporWebs. All rights reserved.</span>
          <div className="flex items-center space-x-1">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-error-500 fill-current" />
            <span>for developers</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
          <span className="hidden sm:inline">Ultra-secure WebContainer technology</span>
          <a
            href="https://www.appsorweb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-primary-400 transition-colors group opacity-0 hover:opacity-100"
            style={{ 
              position: 'relative',
              color: 'transparent',
              backgroundImage: 'linear-gradient(45deg, transparent 49%, rgba(59, 130, 246, 0.1) 50%, transparent 51%)',
              backgroundSize: '100% 100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.color = 'rgb(96, 165, 250)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0';
              e.currentTarget.style.color = 'transparent';
            }}
          >
            <span>Designed by Appsorwebs</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
    </motion.footer>
  );
};