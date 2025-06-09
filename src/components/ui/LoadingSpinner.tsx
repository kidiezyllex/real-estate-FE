import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Outer spinning circle */}
        <div 
          className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full animate-spin`}
          style={{
            borderTopColor: '#604AE3',
            borderRightColor: '#604AE3',
            borderBottomColor: 'transparent',
            borderLeftColor: 'transparent',
            animationDuration: '1s'
          }}
        />
        
        {/* Inner pulsing dot */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full animate-pulse"
          style={{
            backgroundColor: '#604AE3',
            animationDuration: '1.5s'
          }}
        />
      </div>
    </div>
  );
}

// Component với text loading
export function LoadingSpinnerWithText({ 
  text = 'Đang tải...', 
  size = 'md',
  className = '' 
}: LoadingSpinnerProps & { text?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <LoadingSpinner size={size} />
      <p className="text-gray-600 font-medium animate-pulse">{text}</p>
    </div>
  );
} 