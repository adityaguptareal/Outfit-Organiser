
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  animateOnScroll?: boolean;
  animationType?: 'fade' | 'slide-up' | 'slide-down' | 'scale';
  delay?: number;
  interactive?: boolean;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  animateOnScroll = true,
  animationType = 'fade',
  delay = 0,
  interactive = false,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(!animateOnScroll);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Animation classes based on type
  const getAnimationClass = () => {
    if (!isVisible) return 'opacity-0';
    
    switch (animationType) {
      case 'slide-up':
        return 'animate-slide-up';
      case 'slide-down':
        return 'animate-slide-down';
      case 'scale':
        return 'animate-scale-in';
      default:
        return 'animate-fade-in';
    }
  };

  // Interactive hover effect styles
  const interactiveStyles = interactive 
    ? 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:shadow-sm cursor-pointer' 
    : '';

  useEffect(() => {
    // Set loaded state after delay for staggered animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, delay);

    if (animateOnScroll) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        clearTimeout(timer);
        observer.disconnect();
      };
    }

    return () => clearTimeout(timer);
  }, [animateOnScroll, delay]);

  return (
    <div
      ref={ref}
      className={cn(
        'bg-card rounded-lg overflow-hidden',
        isLoaded ? getAnimationClass() : 'opacity-0',
        interactiveStyles,
        className
      )}
      style={{ 
        transitionDelay: `${delay}ms`,
        willChange: 'transform, opacity'
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
