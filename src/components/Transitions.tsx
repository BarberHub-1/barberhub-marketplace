
import React, { ReactNode } from 'react';
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export const FadeIn: React.FC<FadeInProps> = ({ 
  children, 
  delay = 0, 
  duration = 500, 
  className = "",
  direction = 'none'
}) => {
  const getDirectionClasses = () => {
    switch (direction) {
      case 'up':
        return 'animate-fade-up';
      case 'right':
        return 'animate-slide-in-right';
      default:
        return 'animate-fade-in';
    }
  };

  return (
    <div 
      className={cn(
        'opacity-0', 
        getDirectionClasses(),
        className
      )}
      style={{ 
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  );
};

export const StaggeredContainer: React.FC<{
  children: ReactNode;
  className?: string;
  baseDelay?: number;
  staggerDelay?: number;
}> = ({ 
  children, 
  className = "", 
  baseDelay = 0,
  staggerDelay = 100
}) => {
  const childrenArray = React.Children.toArray(children);
  
  return (
    <div className={className}>
      {childrenArray.map((child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            key: index,
            delay: baseDelay + (index * staggerDelay)
          });
        }
        return child;
      })}
    </div>
  );
};
