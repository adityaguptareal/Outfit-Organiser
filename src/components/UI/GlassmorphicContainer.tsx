
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassmorphicContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'light' | 'dark';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

const GlassmorphicContainer: React.FC<GlassmorphicContainerProps> = ({
  children,
  variant = 'light',
  intensity = 'medium',
  className,
  ...props
}) => {
  // Determine blur and opacity based on intensity
  const getBlurValue = () => {
    switch (intensity) {
      case 'low': return 'backdrop-blur-sm';
      case 'high': return 'backdrop-blur-xl';
      default: return 'backdrop-blur-md';
    }
  };

  const getBackgroundOpacity = () => {
    if (variant === 'light') {
      switch (intensity) {
        case 'low': return 'bg-white/30';
        case 'high': return 'bg-white/80';
        default: return 'bg-white/60';
      }
    } else {
      switch (intensity) {
        case 'low': return 'bg-gray-900/30';
        case 'high': return 'bg-gray-900/80';
        default: return 'bg-gray-900/60';
      }
    }
  };

  const getBorderStyles = () => {
    return variant === 'light' 
      ? 'border border-white/20' 
      : 'border border-gray-700/20';
  };

  const getShadowStyles = () => {
    return variant === 'light'
      ? 'shadow-sm'
      : 'shadow-md';
  };

  return (
    <div
      className={cn(
        'rounded-xl',
        getBlurValue(),
        getBackgroundOpacity(),
        getBorderStyles(),
        getShadowStyles(),
        'transition-all duration-300 ease-out',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassmorphicContainer;
