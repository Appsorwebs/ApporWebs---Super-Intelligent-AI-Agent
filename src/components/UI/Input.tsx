import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  className = '',
  onKeyPress,
  ...props
}, ref) => {
  return (
    <motion.div 
      className="space-y-1"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {label && (
        <label className="block text-sm font-medium text-dark-200 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-dark-400">
              {icon}
            </div>
          </div>
        )}
        <input
          ref={ref}
          className={`
            block w-full rounded-lg border border-dark-600 bg-dark-800 
            px-3 py-2 text-white placeholder-dark-400 
            focus:border-primary-500 focus:ring-1 focus:ring-primary-500 
            transition-colors duration-200
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-error-500' : ''}
            ${className}
          `}
          onKeyPress={onKeyPress}
          {...props}
        />
      </div>
      {error && (
        <motion.p 
          className="text-sm text-error-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
});

Input.displayName = 'Input';