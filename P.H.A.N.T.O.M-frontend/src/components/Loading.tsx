import React from 'react';
import PhantomLoading from './common/PhantomLoading';

interface LoadingProps {
  variant?: 'spinner' | 'pulse' | 'dots' | 'bars' | 'skeleton';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  text,
  fullScreen = false,
  className = ''
}) => {
  return (
    <PhantomLoading
      variant={variant}
      size={size}
      text={text}
      fullScreen={fullScreen}
      className={className}
    />
  );
};

export default Loading; 